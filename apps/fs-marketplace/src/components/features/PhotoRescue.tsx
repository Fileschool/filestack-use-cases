"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

import { Dropzone } from "@/components/features/Dropzone";
import { cdnUrl, enhanceUrl, upscaleUrl } from '@/lib/filestack';
import { formatBytes } from '@/lib/utils';
import type { EnhancePreset, IStoredFile } from '@/interfaces/filestack.interface';

const PRESETS: { value: EnhancePreset; label: string; when: string }[] = [
  { value: "auto", label: "Auto", when: "Let Filestack decide" },
  { value: "fix_dark", label: "Fix dark", when: "Shot indoors without a flash" },
  { value: "fix_tint", label: "Fix tint", when: "Yellow or blue colour cast" },
  { value: "vivid", label: "Vivid", when: "Flat, washed-out product shot" },
  { value: "outdoor", label: "Outdoor", when: "Hazy daylight photo" },
];

/** The sizes a storefront actually needs, all from one handle. */
const STOREFRONT = [
  { label: "Search tile", tasks: ["resize=width:200,height:200,fit:crop", "output=format:webp"] },
  { label: "Listing card", tasks: ["resize=width:400,height:300,fit:crop", "output=format:webp"] },
  { label: "Full view", tasks: ["resize=width:1200,fit:max", "output=format:webp"] },
];

function UrlBar({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        });
      }}
      className="mono mt-2 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px]"
      style={{ background: "var(--brand-50)", color: "var(--brand-500)" }}
      title="Copy URL"
    >
      <span className="truncate">{url.replace("https://cdn.filestackcontent.com/", "")}</span>
      {copied ? (
        <Check className="ml-auto size-3.5 shrink-0 text-emerald-500" />
      ) : (
        <Copy className="ml-auto size-3.5 shrink-0" />
      )}
    </button>
  );
}

export function PhotoRescue() {
  const [file, setFile] = useState<IStoredFile | null>(null);
  const [preset, setPreset] = useState<EnhancePreset>("fix_dark");
  const [doubled, setDoubled] = useState(true);

  if (!file) {
    return (
      <div className="mx-auto max-w-xl">
        <Dropzone
          onFiles={(files) => setFile(files[0] ?? null)}
          accept={["image/*"]}
          label="Upload your photo"
          hint="A dim or small one is fine, that is the point"
        />
      </div>
    );
  }

  const original = cdnUrl(file.handle, ["resize=width:600,fit:max"]);
  const enhanced = enhanceUrl(file.handle, preset, ["resize=width:600,fit:max"]);
  const enlarged = doubled
    ? upscaleUrl(file.handle, {}, ["resize=width:600,fit:max"])
    : original;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{file.filename}</p>
          <p className="text-xs" style={{ color: "var(--brand-500)" }}>
            {file.mimetype} · {formatBytes(file.size)}
          </p>
        </div>
        <button type="button" onClick={() => setFile(null)} className="btn-secondary">
          Try another photo
        </button>
      </div>

      {/* enhance */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">
            <span className="mono" style={{ color: "var(--accent)" }}>enhance</span>{" "}
            rescues the colour
          </h2>
          <select
            value={preset}
            onChange={(event) => setPreset(event.target.value as EnhancePreset)}
            className="input w-auto"
          >
            {PRESETS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label} — {item.when}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <figure className="card overflow-hidden p-3">
            <figcaption className="label mb-2">As uploaded</figcaption>
            <img src={original} alt="Original" className="w-full rounded-lg" />
            <UrlBar url={original} />
          </figure>
          <figure className="card overflow-hidden p-3">
            <figcaption className="label mb-2" style={{ color: "var(--accent)" }}>
              enhance=preset:{preset}
            </figcaption>
            <img src={enhanced} alt={`Enhanced with ${preset}`} className="w-full rounded-lg" />
            <UrlBar url={enhanced} />
          </figure>
        </div>
      </section>

      {/* upscale */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">
            <span className="mono" style={{ color: "var(--accent)" }}>upscale</span>{" "}
            clears the size minimum
          </h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={doubled}
              onChange={(event) => setDoubled(event.target.checked)}
            />
            Apply upscale
          </label>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--brand-500)" }}>
          With no parameters it returns exactly twice the width and height, so a 500px
          seller photo clears a 1000px catalogue minimum without the seller doing anything.
        </p>
        <figure className="card mt-4 overflow-hidden p-3">
          <img src={enlarged} alt="Upscaled" className="w-full rounded-lg" />
          <UrlBar url={enlarged} />
        </figure>
      </section>

      {/* storefront sizes */}
      <section>
        <h2 className="text-lg font-bold">One handle, every storefront size</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--brand-500)" }}>
          The rescued photo now feeds every surface. Each of these is the same handle with
          a different task chain, rendered once and cached at the edge.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {STOREFRONT.map((size) => {
            const url = cdnUrl(file.handle, [`enhance=preset:${preset}`, ...size.tasks]);
            return (
              <figure key={size.label} className="card p-3">
                <figcaption className="label mb-2">{size.label}</figcaption>
                <img src={url} alt={size.label} className="w-full rounded-lg" />
                <UrlBar url={url} />
              </figure>
            );
          })}
        </div>
      </section>
    </div>
  );
}
