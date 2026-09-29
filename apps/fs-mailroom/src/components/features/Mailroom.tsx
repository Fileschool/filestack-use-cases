"use client";

import { useState } from "react";
import { AlertTriangle, Inbox, UserCheck, UserX } from "lucide-react";

import { Dropzone } from "@/components/features/Dropzone";
import { BRAND } from '@/lib/copy';
import { newReference, useSubmissionStore } from '@/store/submissionStore';
import { TaskChip } from "@/components/ui/TaskChip";
import { cdnUrl, signedTaskSegment } from '@/lib/filestack';
import { requestSignedUrl } from '@/services/filestack.service';
import type { IEnvelopeOcrResult, IOcrResult, IStoredFile } from '@/interfaces/filestack.interface';

/** Who the mailroom can route to. In production this is your directory. */
const DIRECTORY = [
  { name: "Amara Okafor", team: "Finance" },
  { name: "Daniel Whitfield", team: "Legal" },
  { name: "Zainab Bello", team: "Operations" },
  { name: "Kwabena Mensah", team: "Facilities" },
  { name: "Petra Novak", team: "People" },
];

type Item = {
  file: IStoredFile;
  state: "reading" | "done" | "error";
  result?: IEnvelopeOcrResult;
  /** The contents, flattened and read so the item is searchable. */
  contents?: string;
  /** Set when the contents could not be indexed, so the row can say so. */
  indexFailed?: boolean;
  match?: (typeof DIRECTORY)[number] | null;
  error?: string;
};

/** Loose surname match, which is all a recipient line reliably gives you. */
function matchRecipient(name?: string) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return (
    DIRECTORY.find((person) => lower.includes(person.name.toLowerCase())) ??
    DIRECTORY.find((person) =>
      person.name.split(" ").some((part) => part.length > 3 && lower.includes(part.toLowerCase())),
    ) ??
    null
  );
}

export function Mailroom() {
  const [items, setItems] = useState<Item[]>([]);
  const recordSubmission = useSubmissionStore((state) => state.add);

  async function ingest(files: IStoredFile[]) {
    const pending: Item[] = files.map((file) => ({ file, state: "reading" }));
    setItems((current) => [...pending, ...current]);

    await Promise.all(
      files.map(async (file) => {
        try {
          const signed = await requestSignedUrl(file.handle, [signedTaskSegment({ task: 'envelope_ocr' })]);
          const response = await fetch(signed);
          if (!response.ok) throw new Error(`envelope_ocr returned ${response.status}`);
          const result = (await response.json()) as IEnvelopeOcrResult;

          const match = matchRecipient(result.recipient_name);

          // The envelope tells us where it goes. The contents are flattened
          // and read separately so the item is searchable in the archive.
          let contents: string | undefined;
          let indexFailed = false;
          try {
            const indexUrl = await requestSignedUrl(file.handle, [
              signedTaskSegment({ task: 'doc_detection', coords: false, preprocess: true }),
              signedTaskSegment({ task: 'ocr' }),
            ]);
            const indexed = await fetch(indexUrl);
            if (indexed.ok) {
              contents = ((await indexed.json()) as IOcrResult).text;
            }
          } catch (indexError) {
            // Routing succeeded, but say so rather than pretending it indexed.
            console.error('Could not index the contents:', indexError);
            contents = undefined;
            indexFailed = true;
          }

          setItems((current) =>
            current.map((item) =>
              item.file.handle === file.handle
                ? { ...item, state: "done", result, match, contents, indexFailed }
                : item,
            ),
          );

          // The sorting floor reviews everything that came through today.
          recordSubmission({
            id: file.handle,
            reference: newReference(BRAND.admin.referencePrefix),
            submittedBy: result.sender || "Unidentified sender",
            submittedAt: new Date().toISOString(),
            file,
            status: match ? "processed" : "held",
            extracted: {
              sender: result.sender,
              recipient_name: result.recipient_name,
              recipient_address: result.recipient_address,
              routed_to: match ? `${match.name} · ${match.team}` : undefined,
              indexed: contents ? `${contents.slice(0, 80)}…` : undefined,
            },
          });
        } catch (err) {
          setItems((current) =>
            current.map((item) =>
              item.file.handle === file.handle
                ? {
                    ...item,
                    state: "error",
                    error: err instanceof Error ? err.message : "Could not read the envelope.",
                  }
                : item,
            ),
          );
        }
      }),
    );
  }

  const routed = items.filter((item) => item.match).length;
  const unmatched = items.filter((item) => item.state === "done" && !item.match).length;

  return (
    <div className="space-y-6">
      <Dropzone
        onFiles={(files) => void ingest(files)}
        accept={["image/*"]}
        maxFiles={8}
        label="Add this morning's scans"
        hint="Select the whole batch at once"
      />

      {items.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Inbox, label: "Received", value: items.length },
            { icon: UserCheck, label: "Routed automatically", value: routed },
            { icon: UserX, label: "Held for a supervisor", value: unmatched },
          ].map((stat) => (
            <div key={stat.label} className="card flex items-center gap-3 p-4">
              <stat.icon className="size-5" style={{ color: "var(--accent)" }} />
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs" style={{ color: "var(--brand-500)" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.file.handle} className="card overflow-hidden">
            <div className="grid gap-4 p-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <img
                src={cdnUrl(item.file.handle, ["resize=width:320,fit:max"])}
                alt={item.file.filename}
                className="w-full rounded-lg"
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <TaskChip
                    task="Envelope reading"
                    state={item.state === "reading" ? "running" : item.state === "done" ? "done" : "error"}
                  />
                  {item.match ? (
                    <span className="pill" style={{ background: "rgba(16,185,129,.12)", color: "#0f9d6a" }}>
                      Routed to {item.match.name} · {item.match.team}
                    </span>
                  ) : item.state === "done" ? (
                    <span className="pill" style={{ background: "rgba(245,158,11,.14)", color: "#92400e" }}>
                      No match on your staff list
                    </span>
                  ) : null}
                </div>

                {item.state === "done" && item.result && (
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    {[
                      ["sender", item.result.sender],
                      ["recipient_name", item.result.recipient_name],
                      ["recipient_address", item.result.recipient_address],
                    ].map(([key, value]) => (
                      <div key={key}>
                        <dt className="mono text-[11px]" style={{ color: "var(--accent)" }}>
                          {key}
                        </dt>
                        <dd className="mt-0.5 leading-5">
                          {value || <span style={{ color: "var(--brand-500)" }}>not found</span>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {item.indexFailed && (
                  <p className="mt-3 text-xs" style={{ color: "#8a5b14" }}>
                    Routed, but the contents could not be indexed for search.
                  </p>
                )}

                {item.contents && (
                  <div className="mt-3">
                    <p className="label">Indexed for search</p>
                    <p
                      className="mt-1 line-clamp-2 text-xs leading-5"
                      style={{ color: "var(--brand-500)" }}
                    >
                      {item.contents}
                    </p>
                  </div>
                )}

                {item.state === "error" && (
                  <p className="mt-3 flex items-start gap-2 text-xs" style={{ color: "#92400e" }}>
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>
                      {item.error} envelope_ocr requires a signed policy, so{" "}
                      <code className="mono">FILESTACK_APP_SECRET</code> must be set and the
                      task enabled on your plan.
                    </span>
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
