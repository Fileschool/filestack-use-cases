"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

import { pickFiles } from "@/services/filestack.service";
import { hasFilestackKey } from '@/lib/filestack';
import type { IStoredFile } from '@/interfaces/filestack.interface';

export function Dropzone({
  onFiles,
  accept,
  maxFiles = 1,
  label = "Upload a file",
  hint,
}: {
  onFiles: (files: IStoredFile[]) => void;
  accept?: string[];
  maxFiles?: number;
  label?: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hasFilestackKey()) {
    return (
      <div className="rounded-xl border border-dashed p-4 text-sm"
           style={{ borderColor: "#f59e0b", background: "rgba(245,158,11,.08)", color: "#92400e" }}>
        Set <code className="mono font-semibold">NEXT_PUBLIC_FILESTACK_API_KEY</code> in{" "}
        <code className="mono font-semibold">.env</code> to enable uploads.
      </div>
    );
  }

  async function open() {
    setError(null);
    setBusy(true);
    try {
      const files = await pickFiles({ accept, maxFiles });
      if (files.length > 0) onFiles(files);
    } catch {
      setError("That upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={open}
        disabled={busy}
        className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-7 text-center transition hover:bg-[var(--brand-50)] disabled:opacity-60"
        style={{ borderColor: "var(--brand-200)", background: "#ffffff" }}
      >
        <span
          className="grid size-11 place-items-center rounded-full"
          style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}
        >
          <UploadCloud className="size-5" />
        </span>
        <span className="text-sm font-bold">{busy ? "Opening picker…" : label}</span>
        {hint && (
          <span className="text-xs" style={{ color: "var(--brand-500)" }}>
            {hint}
          </span>
        )}
      </button>
      {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
