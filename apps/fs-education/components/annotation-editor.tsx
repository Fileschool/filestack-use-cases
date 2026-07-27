"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { saveAssignmentAnnotation, saveMarking } from "@/lib/actions/marking";
import { hasFilestackKey, pageImageUrl } from "@/lib/filestack";
import { uploadImageBlob } from "@/lib/filestack-client";
import type { Annotation, OverlayUpload, StoredFile, Stroke } from "@/lib/types";

type Tool = Stroke["tool"];

type Props = {
  file: StoredFile;
  /** Null when the PDF page count could not be read from Filestack. */
  pageCount: number | null;
  annotations: Annotation[];
  backHref: string;
  /** Marking a submission adds the score and comment panel. */
  marking?: {
    submissionId: string;
    studentName: string;
    maxScore: number;
    score: number | null;
    feedback: string;
  };
  assignmentId?: string;
};

const COLORS = [
  { value: "#dc2626", label: "Red" },
  { value: "#ea580c", label: "Orange" },
  { value: "#16a34a", label: "Green" },
  { value: "#2563eb", label: "Blue" },
  { value: "#111827", label: "Black" },
];

const TOOLS: { value: Tool; label: string; icon: string }[] = [
  { value: "pen", label: "Pen", icon: "✎" },
  { value: "highlighter", label: "Highlighter", icon: "▬" },
  { value: "rect", label: "Box", icon: "▢" },
  { value: "arrow", label: "Arrow", icon: "↗" },
  { value: "text", label: "Text", icon: "T" },
];

const WIDTHS = [2, 4, 7];

/** Reference width the stored stroke widths are relative to. */
const BASE_WIDTH = 900;

function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  width: number,
  height: number,
) {
  const points = stroke.points.map((point) => ({
    x: point.x * width,
    y: point.y * height,
  }));
  if (points.length === 0) return;

  const scale = width / BASE_WIDTH;
  const lineWidth = Math.max(1, stroke.width * scale);

  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;

  if (stroke.tool === "highlighter") {
    ctx.globalAlpha = 0.32;
    ctx.lineWidth = lineWidth * 5;
    ctx.lineCap = "butt";
  }

  if (stroke.tool === "pen" || stroke.tool === "highlighter") {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
    if (points.length === 1) ctx.lineTo(points[0].x + 0.1, points[0].y);
    ctx.stroke();
  }

  if (stroke.tool === "rect" && points.length >= 2) {
    const [start, end] = [points[0], points[points.length - 1]];
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }

  if (stroke.tool === "arrow" && points.length >= 2) {
    const [start, end] = [points[0], points[points.length - 1]];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const head = Math.max(10, lineWidth * 4);
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(
      end.x - head * Math.cos(angle - Math.PI / 7),
      end.y - head * Math.sin(angle - Math.PI / 7),
    );
    ctx.lineTo(
      end.x - head * Math.cos(angle + Math.PI / 7),
      end.y - head * Math.sin(angle + Math.PI / 7),
    );
    ctx.closePath();
    ctx.fill();
  }

  if (stroke.tool === "text" && stroke.text) {
    const size = Math.max(12, stroke.width * 6 * scale);
    ctx.font = `700 ${size}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textBaseline = "top";
    stroke.text.split("\n").forEach((line, index) => {
      ctx.fillText(line, points[0].x, points[0].y + index * size * 1.25);
    });
  }

  ctx.restore();
}

export function AnnotationEditor({
  file,
  pageCount,
  annotations,
  backHref,
  marking,
  assignmentId,
}: Props) {
  const [page, setPage] = useState(1);
  const [strokesByPage, setStrokesByPage] = useState<Record<number, Stroke[]>>(
    () =>
      Object.fromEntries(
        annotations.map((annotation) => [annotation.page, annotation.strokes]),
      ),
  );
  const [dirtyPages, setDirtyPages] = useState<Set<number>>(new Set());

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0].value);
  const [width, setWidth] = useState(WIDTHS[1]);

  const [score, setScore] = useState(marking?.score?.toString() ?? "");
  const [feedback, setFeedback] = useState(marking?.feedback ?? "");

  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [textDraft, setTextDraft] = useState<{ x: number; y: number } | null>(
    null,
  );

  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveStroke = useRef<Stroke | null>(null);

  const strokes = useMemo(
    () => strokesByPage[page] ?? [],
    [strokesByPage, page],
  );
  const dirty = dirtyPages.has(page) || Boolean(marking);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const pixelWidth = Math.round(rect.width * dpr);
    const pixelHeight = Math.round(rect.height * dpr);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const all = liveStroke.current ? [...strokes, liveStroke.current] : strokes;
    for (const stroke of all) drawStroke(ctx, stroke, rect.width, rect.height);
  }, [strokes]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Keep the drawing crisp and correctly placed while the page reflows.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => redraw());
    observer.observe(stage);
    return () => observer.disconnect();
  }, [redraw]);

  function pointFrom(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  function commit(stroke: Stroke) {
    setStrokesByPage((current) => ({
      ...current,
      [page]: [...(current[page] ?? []), stroke],
    }));
    setDirtyPages((current) => new Set(current).add(page));
    setStatus("idle");
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (textDraft) return;
    const point = pointFrom(event);

    if (tool === "text") {
      setTextDraft(point);
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    liveStroke.current = { tool, color, width, points: [point] };
    redraw();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const stroke = liveStroke.current;
    if (!stroke) return;

    const point = pointFrom(event);
    if (stroke.tool === "rect" || stroke.tool === "arrow") {
      stroke.points = [stroke.points[0], point];
    } else {
      stroke.points.push(point);
    }
    redraw();
  }

  function handlePointerUp() {
    const stroke = liveStroke.current;
    liveStroke.current = null;
    if (!stroke) return;

    const isDrag = stroke.points.length > 1;
    if (stroke.tool === "pen" || stroke.tool === "highlighter" || isDrag) {
      commit(stroke);
    } else {
      redraw();
    }
  }

  function undo() {
    setStrokesByPage((current) => ({
      ...current,
      [page]: (current[page] ?? []).slice(0, -1),
    }));
    setDirtyPages((current) => new Set(current).add(page));
    setStatus("idle");
  }

  function clearPage() {
    setStrokesByPage((current) => ({ ...current, [page]: [] }));
    setDirtyPages((current) => new Set(current).add(page));
    setStatus("idle");
  }

  /** Renders the current page's strokes onto a transparent PNG for Filestack. */
  async function renderOverlay(): Promise<OverlayUpload> {
    if (strokes.length === 0) return null;
    if (!hasFilestackKey()) return null;

    const image = imageRef.current;
    const naturalWidth = image?.naturalWidth || 1200;
    const naturalHeight = image?.naturalHeight || 1600;
    const exportWidth = Math.min(naturalWidth, 2000);
    const exportHeight = Math.round(
      exportWidth * (naturalHeight / naturalWidth),
    );

    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    for (const stroke of strokes) {
      drawStroke(ctx, stroke, exportWidth, exportHeight);
    }

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) return null;

    const uploaded = await uploadImageBlob(
      blob,
      `annotation-page-${page}.png`,
    );
    return { url: uploaded.url, handle: uploaded.handle };
  }

  async function savePage(): Promise<boolean> {
    setStatus("saving");
    setError(null);

    try {
      const overlay = await renderOverlay();

      const result = marking
        ? await saveMarking({
            submissionId: marking.submissionId,
            page,
            overlay,
            strokes,
            score,
            feedback,
          })
        : await saveAssignmentAnnotation({
            assignmentId: assignmentId ?? "",
            page,
            overlay,
            strokes,
          });

      if (result.error) {
        setError(result.error);
        setStatus("idle");
        return false;
      }

      setDirtyPages((current) => {
        const next = new Set(current);
        next.delete(page);
        return next;
      });
      setStatus("saved");
      return true;
    } catch {
      setError("Could not save. Check your connection and try again.");
      setStatus("idle");
      return false;
    }
  }

  async function goToPage(next: number) {
    if (next < 1 || (pageCount && next > pageCount)) return;
    if (dirtyPages.has(page) && !(await savePage())) return;

    setImageFailed(false);
    setStatus("idle");
    setPage(next);
  }

  const canGoForward = pageCount === null || page < pageCount;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <div className="card sticky top-[4.5rem] z-10 flex flex-wrap items-center gap-2 p-2.5">
          <div className="flex gap-1">
            {TOOLS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTool(item.value)}
                title={item.label}
                aria-pressed={tool === item.value}
                className={`grid size-9 place-items-center rounded-lg text-sm font-bold transition ${
                  tool === item.value
                    ? "bg-brand-700 text-white"
                    : "bg-brand-50 text-brand-600 hover:bg-brand-100"
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>

          <span className="h-6 w-px bg-brand-100" />

          <div className="flex gap-1">
            {COLORS.map((swatch) => (
              <button
                key={swatch.value}
                type="button"
                onClick={() => setColor(swatch.value)}
                title={swatch.label}
                aria-pressed={color === swatch.value}
                className={`size-7 rounded-full ring-2 ring-offset-2 transition ${
                  color === swatch.value
                    ? "ring-brand-700"
                    : "ring-transparent hover:ring-brand-200"
                }`}
                style={{ backgroundColor: swatch.value }}
              />
            ))}
          </div>

          <span className="h-6 w-px bg-brand-100" />

          <div className="flex gap-1">
            {WIDTHS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setWidth(value)}
                title={`${value}px`}
                aria-pressed={width === value}
                className={`grid size-9 place-items-center rounded-lg transition ${
                  width === value
                    ? "bg-brand-100"
                    : "bg-white hover:bg-brand-50"
                }`}
              >
                <span
                  className="rounded-full bg-brand-800"
                  style={{ width: value * 2, height: value * 2 }}
                />
              </button>
            ))}
          </div>

          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={strokes.length === 0}
              className="btn-secondary px-3 py-2 text-xs"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={clearPage}
              disabled={strokes.length === 0}
              className="btn-secondary px-3 py-2 text-xs"
            >
              Clear page
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          className="transparency-grid relative mt-4 overflow-hidden rounded-2xl border border-brand-200 bg-white select-none"
        >
          <img
            ref={imageRef}
            key={`${file.handle}-${page}`}
            src={pageImageUrl(file, page)}
            alt={`Page ${page} of ${file.name}`}
            draggable={false}
            onLoad={redraw}
            onError={() => setImageFailed(true)}
            className="block w-full"
          />

          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 h-full w-full touch-none"
            style={{ cursor: tool === "text" ? "text" : "crosshair" }}
          />

          {textDraft && (
            <input
              autoFocus
              placeholder="Type, then press Enter"
              onKeyDown={(event) => {
                if (event.key === "Escape") setTextDraft(null);
                if (event.key !== "Enter") return;

                const value = event.currentTarget.value.trim();
                if (value) {
                  commit({
                    tool: "text",
                    color,
                    width,
                    points: [textDraft],
                    text: value,
                  });
                }
                setTextDraft(null);
              }}
              onBlur={() => setTextDraft(null)}
              style={{
                left: `${textDraft.x * 100}%`,
                top: `${textDraft.y * 100}%`,
                color,
              }}
              className="absolute z-10 rounded-md border-2 border-brand-500 bg-white/95 px-2 py-1 text-sm font-bold shadow-lg outline-none"
            />
          )}

          {imageFailed && (
            <p className="absolute inset-x-0 bottom-0 bg-rose-600 px-4 py-2 text-center text-xs font-semibold text-white">
              This page could not be rendered. It may be past the end of the
              document.
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1 || status === "saving"}
              className="btn-secondary px-3 py-2 text-xs"
            >
              ← Previous page
            </button>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={!canGoForward || status === "saving"}
              className="btn-secondary px-3 py-2 text-xs"
            >
              Next page →
            </button>
          </div>
          <p className="text-xs text-brand-400">
            Page {page}
            {pageCount ? ` of ${pageCount}` : ""} · changes to a page are saved
            when you move on
          </p>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-[4.5rem] lg:self-start">
        {marking && (
          <div className="card p-5">
            <h2 className="section-title">Marking</h2>
            <p className="mt-1.5 text-sm font-bold text-brand-900">
              {marking.studentName}
            </p>

            <div className="mt-4">
              <label htmlFor="score" className="field-label">
                Score
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="score"
                  type="number"
                  min={0}
                  max={marking.maxScore}
                  step="0.5"
                  value={score}
                  onChange={(event) => {
                    setScore(event.target.value);
                    setStatus("idle");
                  }}
                  placeholder="—"
                  className="input"
                />
                <span className="mt-1.5 shrink-0 text-sm font-semibold text-brand-400">
                  / {marking.maxScore}
                </span>
              </div>
              <p className="field-hint">Leave empty to return it unmarked.</p>
            </div>

            <div className="mt-4">
              <label htmlFor="feedback" className="field-label">
                Comments
              </label>
              <textarea
                id="feedback"
                rows={7}
                value={feedback}
                onChange={(event) => {
                  setFeedback(event.target.value);
                  setStatus("idle");
                }}
                placeholder="What went well, what to work on…"
                className="input"
              />
            </div>
          </div>
        )}

        <div className="card space-y-3 p-5">
          <button
            type="button"
            onClick={savePage}
            disabled={status === "saving"}
            className="btn-primary w-full"
          >
            {status === "saving"
              ? "Saving…"
              : marking
                ? "Save marking"
                : "Save markings"}
          </button>

          <Link href={backHref} className="btn-secondary w-full">
            Done
          </Link>

          {error && (
            <p className="text-xs font-semibold text-rose-600">{error}</p>
          )}
          {status === "saved" && !error && (
            <p className="text-xs font-semibold text-emerald-600">
              Saved. The student can see this now.
            </p>
          )}
          {status === "idle" && dirty && strokes.length > 0 && (
            <p className="text-xs text-brand-400">Unsaved changes on this page.</p>
          )}
          {!hasFilestackKey() && (
            <p className="text-xs font-semibold text-amber-700">
              Without a Filestack API key the drawing cannot be uploaded, so the
              student will only see the score and comments.
            </p>
          )}
        </div>

        <div className="card p-5 text-xs leading-6 text-brand-400">
          <p className="section-title">How this works</p>
          <p className="mt-2">
            Pages are rendered from the original file by the Filestack
            Processing API. Your drawing is saved as a separate transparent PNG,
            so the student&apos;s file is never altered — and you can come back
            and edit the markings later.
          </p>
        </div>
      </aside>
    </div>
  );
}
