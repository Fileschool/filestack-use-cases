"use client";

import { useEffect, useState } from "react";
import { Clock, Link2, Lock, ShieldCheck } from "lucide-react";

import { Dropzone } from "@/components/features/Dropzone";
import { TaskChip } from "@/components/ui/TaskChip";
import { cdnUrl, previewUrl, watermarkUrl } from '@/lib/filestack';
import { uploadImageBlob } from '@/services/filestack.service';
import { BRAND } from '@/lib/copy';
import { newReference, useSubmissionStore } from '@/store/submissionStore';
import { formatBytes } from '@/lib/utils';
import type { IStoredFile } from '@/interfaces/filestack.interface';

type Share = { url: string; expiresAt: number; recipient: string };

function Countdown({ expiresAt }: { expiresAt: number }) {
  const [left, setLeft] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, expiresAt - Date.now())), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const expired = left <= 0;
  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);

  return (
    <span
      className="pill mono"
      style={{
        background: expired ? "rgba(244,63,94,.12)" : "rgba(16,185,129,.12)",
        color: expired ? "#e11d48" : "#0f9d6a",
      }}
    >
      <Clock className="size-3.5" />
      {expired ? "Expired" : `${minutes}:${String(seconds).padStart(2, "0")} left`}
    </span>
  );
}

/**
 * Renders the recipient's name to a transparent PNG and uploads it, so the
 * watermark task has a real file to composite. The mark then lives in the
 * pixels rather than in CSS, and survives a screenshot or a download.
 */
async function buildOverlay(recipient: string): Promise<string | null> {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 8);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(123, 45, 59, 0.22)';
  ctx.font = '700 84px Georgia, serif';
  ctx.fillText(`ISSUED TO ${recipient.toUpperCase()}`, 0, 0);
  ctx.font = '400 38px Georgia, serif';
  ctx.fillText('PEMBERTON HALE LLP · NOT FOR CIRCULATION', 0, 90);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  );
  if (!blob) return null;

  const uploaded = await uploadImageBlob(blob, `watermark-${Date.now()}.png`);
  return uploaded.handle;
}

export function SecureShare() {
  const recordSubmission = useSubmissionStore((state) => state.add);
  const [overlayHandle, setOverlayHandle] = useState<string | null>(null);
  const [file, setFile] = useState<IStoredFile | null>(null);
  const [recipient, setRecipient] = useState("A. Okafor");
  const [share, setShare] = useState<Share | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function issue() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      // The signing route holds the app secret and returns a finished URL that
      // stops working on its own. There is no permanent link to leak.
      const response = await fetch("/api/filestack/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: file.handle, tasks: ["ocr"] }),
      });
      const body = (await response.json()) as { url?: string; expiresIn?: number; error?: string };
      if (!response.ok || !body.url) throw new Error(body.error ?? "Could not sign the link");

      // A per-recipient overlay, composited by the watermark task.
      const overlay = await buildOverlay(recipient);
      setOverlayHandle(overlay);

      setShare({
        url: body.url,
        expiresAt: Date.now() + (body.expiresIn ?? 600) * 1000,
        recipient,
      });

      recordSubmission({
        id: `${file.handle}-${Date.now()}`,
        reference: newReference(BRAND.admin.referencePrefix),
        submittedBy: `Issued to ${recipient}`,
        submittedAt: new Date().toISOString(),
        file,
        status: 'processed',
        extracted: {
          recipient,
          expires_in: `${Math.round((body.expiresIn ?? 600) / 60)} minutes`,
          watermark: overlay ? `file:${overlay}` : 'overlay not generated',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not issue the link.");
    } finally {
      setBusy(false);
    }
  }

  if (!file) {
    return (
      <div className="mx-auto max-w-xl">
        <Dropzone
          onFiles={(files) => setFile(files[0] ?? null)}
          accept={["application/pdf", "image/*", ".doc", ".docx"]}
          label="Choose a document to issue"
          hint="A completion statement, a will, anything confidential"
        />
      </div>
    );
  }

  // Once an overlay exists the page is composited by the watermark task, so
  // the mark is in the pixels rather than painted over the top in CSS.
  const pageTasks = ['output=format:png,page:1,density:150', 'resize=width:900,fit:max'];
  const watermarked = overlayHandle
    ? watermarkUrl(file.handle, overlayHandle, pageTasks)
    : cdnUrl(file.handle, pageTasks);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TaskChip task="Signed link" state={share ? "done" : "idle"} />
          <TaskChip task="Watermark" state="done" />
          <TaskChip task="Document preview" state="done" />
        </div>

        <div className="card overflow-hidden">
          {overlayHandle ? (
            /* Composited by Filestack: the mark is in the image itself. */
            <img
              src={watermarked}
              alt={file.filename}
              className="block w-full"
            />
          ) : (
            <iframe
              src={previewUrl(file.handle)}
              className="h-[440px] w-full border-0"
              title={file.filename}
            />
          )}
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--brand-500)' }}>
          {overlayHandle
            ? 'The recipient\u2019s name is composited into the page by the Filestack watermark task, so it survives a screenshot or a download.'
            : 'Issue a link to stamp this page with the recipient\u2019s name.'}
        </p>
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Lock className="size-4" style={{ color: "var(--accent)" }} />
            <p className="truncate text-sm font-bold">{file.filename}</p>
          </div>
          <p className="mt-1 text-xs" style={{ color: "var(--brand-500)" }}>
            {file.mimetype} · {formatBytes(file.size)}
          </p>

          <label htmlFor="recipient" className="label mt-4">
            Issue to
          </label>
          <input
            id="recipient"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            className="input mt-1"
          />

          <button
            type="button"
            onClick={() => void issue()}
            disabled={busy}
            className="btn-primary mt-4 w-full"
          >
            {busy ? "Signing…" : "Issue an expiring link"}
          </button>

          {error && (
            <p className="mt-3 text-xs leading-5 font-semibold text-rose-600">
              {error}
            </p>
          )}
        </div>

        {share && (
          <div className="card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="label">Issued link</h2>
              <Countdown expiresAt={share.expiresAt} />
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--brand-500)" }}>
              Signed for {share.recipient}. The policy is embedded in the URL and the CDN
              refuses it once the expiry passes, so forwarding it buys nothing.
            </p>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(share.url)}
              className="btn-secondary mt-3 w-full"
            >
              <Link2 className="size-4" /> Copy link
            </button>
            <pre
              className="mono mt-3 max-h-32 overflow-auto rounded-lg p-2 text-[10px] leading-4 break-all whitespace-pre-wrap"
              style={{ background: "var(--brand-50)", color: "var(--brand-500)" }}
            >
              {share.url}
            </pre>
          </div>
        )}

        <div className="card p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" style={{ color: "var(--accent)" }} />
            <h2 className="label">Inbound uploads</h2>
          </div>
          <p className="mt-2 text-xs leading-5" style={{ color: "var(--brand-500)" }}>
            Anything a client sends back is screened by the virus detection task in a
            Filestack Workflow before it reaches a fee earner&apos;s queue.
          </p>
        </div>

        <button type="button" onClick={() => setFile(null)} className="btn-secondary w-full">
          Issue another document
        </button>
      </aside>
    </div>
  );
}
