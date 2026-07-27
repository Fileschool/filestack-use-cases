"use client";

import type { PickerResponse } from "filestack-js";
import { useState } from "react";

import { FileThumb } from "@/components/file-thumb";
import { hasFilestackKey } from "@/lib/filestack";
import { filestackClient, toStoredFile } from "@/lib/filestack-client";
import { formatBytes } from "@/lib/format";
import type { StoredFile } from "@/lib/types";

type Props = {
  /** Hidden field the picked file is serialised into for the server action. */
  name: string;
  initialFile?: StoredFile | null;
  accept?: string[];
  /** Renders the `removeAttachment` flag the assignment editor understands. */
  allowRemove?: boolean;
  ctaLabel?: string;
};

const DEFAULT_ACCEPT = [
  "image/*",
  "application/pdf",
  ".doc",
  ".docx",
  ".txt",
  ".md",
];

export function FilePicker({
  name,
  initialFile = null,
  accept = DEFAULT_ACCEPT,
  allowRemove = false,
  ctaLabel = "Choose a file",
}: Props) {
  const [file, setFile] = useState<StoredFile | null>(initialFile);
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keyMissing = !hasFilestackKey();

  async function openPicker() {
    setError(null);
    setBusy(true);

    try {
      const client = await filestackClient();
      const picker = client.picker({
        accept,
        maxFiles: 1,
        fromSources: [
          "local_file_system",
          "url",
          "googledrive",
          "dropbox",
          "onedrive",
        ],
        onUploadDone: (response: PickerResponse) => {
          const uploaded = response.filesUploaded[0];
          if (uploaded) {
            setFile(toStoredFile(uploaded));
            setRemoved(false);
          }
          setBusy(false);
        },
        onCancel: () => setBusy(false),
        onFileUploadFailed: () => {
          setError("That upload failed. Please try again.");
          setBusy(false);
        },
      });

      await picker.open();
    } catch {
      setError("The file picker could not be opened.");
      setBusy(false);
    }
  }

  if (keyMissing) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        Set <code className="font-mono font-semibold">
          NEXT_PUBLIC_FILESTACK_API_KEY
        </code>{" "}
        in <code className="font-mono font-semibold">.env.local</code> to enable
        uploads. Copy <code className="font-mono font-semibold">.env.example</code>{" "}
        to get started.
      </div>
    );
  }

  return (
    <div>
      <input
        type="hidden"
        name={name}
        value={file && !removed ? JSON.stringify(file) : ""}
      />
      {allowRemove && (
        <input
          type="hidden"
          name="removeAttachment"
          value={removed ? "on" : ""}
        />
      )}

      {file && !removed ? (
        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3">
          <FileThumb file={file} size={56} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-900">
              {file.name}
            </p>
            <p className="text-xs text-brand-400">
              {file.mimetype} · {formatBytes(file.size)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={openPicker}
              disabled={busy}
              className="btn-secondary px-3 py-2 text-xs"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                if (initialFile && allowRemove) {
                  setRemoved(true);
                } else {
                  setFile(null);
                }
              }}
              className="btn-danger px-3 py-2 text-xs"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={busy}
          className="flex w-full flex-col items-center gap-1 rounded-xl border border-dashed border-brand-300 bg-white px-4 py-7 text-center transition hover:border-brand-500 hover:bg-brand-50 disabled:opacity-60"
        >
          <span className="text-sm font-semibold text-brand-800">
            {busy ? "Opening picker…" : ctaLabel}
          </span>
          <span className="text-xs text-brand-400">
            Images, PDFs and documents · stored with Filestack
          </span>
        </button>
      )}

      {removed && (
        <p className="mt-2 text-xs font-semibold text-rose-600">
          The attachment will be removed when you save.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => setRemoved(false)}
          >
            Undo
          </button>
        </p>
      )}

      {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
