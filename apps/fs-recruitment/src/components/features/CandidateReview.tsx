"use client";

import { useState } from "react";
import { FileText, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

import { Dropzone } from "@/components/features/Dropzone";
import { BRAND } from '@/lib/copy';
import { newReference, useSubmissionStore } from '@/store/submissionStore';
import { TaskChip } from "@/components/ui/TaskChip";
import { previewUrl, signedTaskSegment } from '@/lib/filestack';
import { formatBytes } from '@/lib/utils';
import { requestSignedUrl } from '@/services/filestack.service';
import type { IOcrResult, IStoredFile } from '@/interfaces/filestack.interface';

type ScanState = "pending" | "clean" | "infected" | "unconfigured";

export function CandidateReview() {
  const recordSubmission = useSubmissionStore((state) => state.add);
  const [file, setFile] = useState<IStoredFile | null>(null);
  const [scan, setScan] = useState<ScanState>("pending");
  const [infections, setInfections] = useState<string[]>([]);
  const [ocr, setOcr] = useState<IOcrResult | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);

  async function onUploaded(uploaded: IStoredFile) {
    setFile(uploaded);
    setScan("pending");
    setOcr(null);
    setOcrError(null);

    // The workflow posts its verdict to our webhook; poll for it.
    let attempts = 0;
    const poll = async (): Promise<void> => {
      attempts += 1;
      const response = await fetch(
        `/api/filestack/virus-webhook?handle=${encodeURIComponent(uploaded.handle)}`,
      );
      const body = (await response.json()) as {
        status: string;
        infected?: boolean;
        infections_list?: string[];
      };

      if (body.status === "complete") {
        setScan(body.infected ? "infected" : "clean");
        setInfections(body.infections_list ?? []);

        // Only screened applications reach a recruiter.
        recordSubmission({
          id: uploaded.handle,
          reference: newReference(BRAND.admin.referencePrefix),
          submittedBy: "Candidate application",
          submittedAt: new Date().toISOString(),
          file: uploaded,
          status: body.infected ? "held" : "processed",
          extracted: {
            virus_detection: body.infected
              ? `Blocked: ${(body.infections_list ?? []).join(", ")}`
              : "No threats found",
          },
        });
        return;
      }
      if (attempts >= 5) {
        setScan("unconfigured");
        return;
      }
      setTimeout(() => void poll(), 1500);
    };
    void poll();
  }

  async function readText() {
    if (!file) return;
    setReading(true);
    setOcrError(null);
    try {
      const signed = await requestSignedUrl(file.handle, [signedTaskSegment({ task: 'ocr' })]);
      const response = await fetch(signed);
      if (!response.ok) throw new Error(`ocr returned ${response.status}`);
      setOcr((await response.json()) as IOcrResult);
    } catch (err) {
      setOcrError(err instanceof Error ? err.message : "Could not read the document.");
    } finally {
      setReading(false);
    }
  }

  if (!file) {
    return (
      <div className="mx-auto max-w-xl">
        <Dropzone
          onFiles={(files) => files[0] && void onUploaded(files[0])}
          accept={["application/pdf", "image/*", ".doc", ".docx"]}
          label="Upload the CV"
          hint="PDF, image or Word document"
        />
      </div>
    );
  }

  const locked = scan === "pending" || scan === "infected";

  const badge = {
    pending: { icon: ShieldQuestion, text: "Scanning, attachment locked", bg: "rgba(245,158,11,.14)", fg: "#92400e" },
    clean: { icon: ShieldCheck, text: "No threats found", bg: "rgba(16,185,129,.12)", fg: "#0f9d6a" },
    infected: { icon: ShieldAlert, text: `Blocked: ${infections.join(", ")}`, bg: "rgba(244,63,94,.12)", fg: "#e11d48" },
    unconfigured: { icon: ShieldQuestion, text: "No workflow configured", bg: "var(--brand-50)", fg: "var(--brand-500)" },
  }[scan];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TaskChip task="Virus detection" state={scan === "pending" ? "running" : scan === "infected" ? "error" : scan === "clean" ? "done" : "idle"} />
          <TaskChip task="Document preview" state={locked ? "idle" : "done"} />
          <TaskChip task="Text extraction" state={reading ? "running" : ocr ? "done" : ocrError ? "error" : "idle"} />
        </div>

        <div className="card overflow-hidden">
          {locked ? (
            <div className="flex h-[460px] flex-col items-center justify-center gap-3 p-8 text-center">
              <badge.icon className="size-10" style={{ color: badge.fg }} />
              <p className="text-sm font-bold">{badge.text}</p>
              <p className="max-w-sm text-xs" style={{ color: "var(--brand-500)" }}>
                The preview stays locked until virus detection reports back. A recruiter
                cannot open an attachment that has not been screened.
              </p>
            </div>
          ) : (
            <iframe
              src={previewUrl(file.handle)}
              className="h-[460px] w-full border-0"
              title={file.filename}
            />
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4" style={{ color: "var(--accent)" }} />
            <p className="truncate text-sm font-bold">{file.filename}</p>
          </div>
          <p className="mt-1 text-xs" style={{ color: "var(--brand-500)" }}>
            {file.mimetype} · {formatBytes(file.size)}
          </p>
          <span className="pill mt-3" style={{ background: badge.bg, color: badge.fg }}>
            <badge.icon className="size-3.5" /> {badge.text}
          </span>

          {scan === "unconfigured" && (
            <p className="mt-3 text-xs leading-5" style={{ color: "var(--brand-500)" }}>
              Virus detection runs in a Filestack Workflow, not as a URL task. Create the
              workflow in the dashboard, add the Intelligence virus detection task, and
              point its webhook at <code className="mono">/api/filestack/virus-webhook</code>.
              The preview is unlocked here so you can still explore the demo.
            </p>
          )}
        </div>

        <div className="card p-5">
          <h2 className="label">Searchable text</h2>
          <button
            type="button"
            onClick={() => void readText()}
            disabled={reading || locked}
            className="btn-primary mt-3 w-full"
          >
            {reading ? "Reading…" : "Extract with ocr"}
          </button>
          {ocrError && <p className="mt-2 text-xs font-semibold text-rose-600">{ocrError}</p>}
          {ocr?.text && (
            <pre
              className="mono mt-3 max-h-56 overflow-auto rounded-lg p-3 text-[11px] leading-5 whitespace-pre-wrap"
              style={{ background: "var(--brand-50)", color: "var(--brand-500)" }}
            >
              {ocr.text}
            </pre>
          )}
        </div>

        <button type="button" onClick={() => setFile(null)} className="btn-secondary w-full">
          Review another application
        </button>
      </aside>
    </div>
  );
}
