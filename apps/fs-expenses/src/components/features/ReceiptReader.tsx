"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Dropzone } from "@/components/features/Dropzone";
import { BRAND } from '@/lib/copy';
import { newReference, useSubmissionStore } from '@/store/submissionStore';
import { TaskChip } from "@/components/ui/TaskChip";
import { cdnUrl, signedTaskSegment } from '@/lib/filestack';
import { requestSignedUrl } from '@/services/filestack.service';
import type { IOcrResult, IStoredFile } from '@/interfaces/filestack.interface';

type Stage = "idle" | "cleaning" | "reading" | "done" | "error";

/** A word plus a box normalised to 0..1 of the image. */
type Box = { text: string; x: number; y: number; w: number; h: number };

/**
 * OCR bounding boxes have appeared in more than one shape across versions, so
 * normalise defensively rather than trusting a single field layout.
 */
function toBoxes(result: IOcrResult, imgW: number, imgH: number): Box[] {
  const boxes: Box[] = [];
  if (!imgW || !imgH) return boxes;

  for (const area of result.document?.text_areas ?? []) {
    for (const line of area.lines ?? []) {
      for (const word of line.words ?? []) {
        const raw = (word as { bounding_box?: unknown }).bounding_box;
        if (!raw) continue;

        let x: number | undefined;
        let y: number | undefined;
        let w: number | undefined;
        let h: number | undefined;

        if (Array.isArray(raw) && raw.length >= 2) {
          // A list of points: derive the extent.
          const pts = raw as { x: number; y: number }[];
          const xs = pts.map((p) => p.x);
          const ys = pts.map((p) => p.y);
          x = Math.min(...xs);
          y = Math.min(...ys);
          w = Math.max(...xs) - x;
          h = Math.max(...ys) - y;
        } else if (typeof raw === "object") {
          const b = raw as { x?: number; y?: number; width?: number; height?: number };
          x = b.x;
          y = b.y;
          w = b.width;
          h = b.height;
        }

        if (x === undefined || y === undefined || !w || !h) continue;

        // Values may already be normalised; if not, divide by the image size.
        const norm = x <= 1 && y <= 1 && w <= 1 && h <= 1;
        boxes.push({
          text: word.text ?? "",
          x: norm ? x : x / imgW,
          y: norm ? y : y / imgH,
          w: norm ? w : w / imgW,
          h: norm ? h : h / imgH,
        });
      }
    }
  }
  return boxes;
}

/** Pulls the most likely total out of the flat text. */
function guessTotal(text: string): string | null {
  const matches = [...text.matchAll(/(?:total|amount due|balance)\D{0,12}([\d.,]+)/gi)];
  const last = matches.at(-1);
  if (last) return last[1];
  const money = [...text.matchAll(/\d+[.,]\d{2}/g)].map((m) => m[0]);
  return money.length > 0 ? money.sort((a, b) => parseFloat(b.replace(",", ".")) - parseFloat(a.replace(",", "."))) [0] : null;
}

export function ReceiptReader() {
  const recordSubmission = useSubmissionStore((state) => state.add);
  const [file, setFile] = useState<IStoredFile | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [ocr, setOcr] = useState<IOcrResult | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [showBoxes, setShowBoxes] = useState(true);

  // The cleaned page: doc_detection warps and preprocesses, enhance fixes colour.
  const cleanedTasks = ["doc_detection=coords:false,preprocess:true", "enhance=preset:fix_dark"];
  const cleanedUrl = file ? cdnUrl(file.handle, cleanedTasks) : "";

  const boxes = useMemo(
    () => (ocr && dims ? toBoxes(ocr, dims.w, dims.h) : []),
    [ocr, dims],
  );
  const total = useMemo(() => (ocr?.text ? guessTotal(ocr.text) : null), [ocr]);

  async function run(uploaded: IStoredFile) {
    setFile(uploaded);
    setOcr(null);
    setError(null);
    setStage("cleaning");

    try {
      // doc_detection and ocr both reject unsigned requests, so the URL is
      // built by our own route and the app secret never reaches the browser.
      setStage("reading");
      const signed = await requestSignedUrl(uploaded.handle, [
        signedTaskSegment({ task: 'doc_detection', coords: false, preprocess: true }),
        signedTaskSegment({ task: 'ocr' }),
      ]);

      const response = await fetch(signed);
      if (!response.ok) throw new Error(`OCR returned ${response.status}`);
      const result = (await response.json()) as IOcrResult;
      setOcr(result);
      setStage("done");

      // Finance reviews the claim, not the photograph.
      recordSubmission({
        id: uploaded.handle,
        reference: newReference(BRAND.admin.referencePrefix),
        submittedBy: "Submitted from the mobile app",
        submittedAt: new Date().toISOString(),
        file: uploaded,
        status: "processed",
        extracted: {
          total: result.text ? (guessTotal(result.text) ?? undefined) : undefined,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read the receipt.");
      setStage("error");
    }
  }

  if (!file) {
    return (
      <div className="mx-auto max-w-xl">
        <Dropzone
          onFiles={(files) => files[0] && void run(files[0])}
          accept={["image/*"]}
          label="Photograph a receipt"
          hint="Crooked and badly lit is fine"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TaskChip task="Document detection" state={stage === "cleaning" ? "running" : stage === "idle" ? "idle" : "done"} />
          <TaskChip task="Image enhancement" state={stage === "done" ? "done" : "idle"} />
          <TaskChip
            task="Text extraction"
            state={stage === "reading" ? "running" : stage === "done" ? "done" : stage === "error" ? "error" : "idle"}
          />
        </div>

        <div className="card relative overflow-hidden p-2">
          <img
            src={cleanedUrl}
            alt="Cleaned receipt"
            className="block w-full rounded-lg"
            onLoad={(event) =>
              setDims({
                w: event.currentTarget.naturalWidth,
                h: event.currentTarget.naturalHeight,
              })
            }
          />
          {showBoxes &&
            boxes.map((box, index) => (
              <span
                key={`${box.text}-${index}`}
                title={box.text}
                className="pointer-events-none absolute rounded-[2px]"
                style={{
                  left: `calc(${box.x * 100}% + 0.5rem)`,
                  top: `calc(${box.y * 100}% + 0.5rem)`,
                  width: `${box.w * 100}%`,
                  height: `${box.h * 100}%`,
                  border: "1px solid var(--accent)",
                  background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                }}
              />
            ))}
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showBoxes}
            onChange={(event) => setShowBoxes(event.target.checked)}
          />
          Highlight what we read, and where we read it ({boxes.length})
        </label>
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          <h2 className="label">Extracted</h2>
          {stage === "reading" && (
            <p className="mt-3 text-sm" style={{ color: "var(--brand-500)" }}>
              Reading the receipt…
            </p>
          )}
          {total && (
            <p className="mt-2 text-3xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
              {total}
            </p>
          )}
          {ocr?.text_area_percentage !== undefined && (
            <p className="mt-2 text-xs" style={{ color: "var(--brand-500)" }}>
              Text covers {Math.round((ocr.text_area_percentage ?? 0) * 100) / 100}% of the page
            </p>
          )}
          {ocr?.text && (
            <pre
              className="mono mt-3 max-h-64 overflow-auto rounded-lg p-3 text-[11px] leading-5 whitespace-pre-wrap"
              style={{ background: "var(--brand-50)", color: "var(--brand-500)" }}
            >
              {ocr.text}
            </pre>
          )}
        </div>

        {error && (
          <div
            className="card flex items-start gap-2 p-4 text-xs"
            style={{ borderColor: "#f59e0b", background: "rgba(245,158,11,.08)", color: "#92400e" }}
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              {error}
              <br />
              <strong>ocr</strong> and <strong>doc_detection</strong> require a signed
              policy. Set <code className="mono">FILESTACK_APP_SECRET</code> in{" "}
              <code className="mono">.env</code>, and check both tasks are enabled on your plan.
            </span>
          </div>
        )}

        <button type="button" onClick={() => setFile(null)} className="btn-secondary w-full">
          Capture another receipt
        </button>
      </aside>
    </div>
  );
}
