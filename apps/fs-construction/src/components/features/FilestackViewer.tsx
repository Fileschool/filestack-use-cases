'use client';

import { FC, useState } from 'react';
import { Download, RotateCw, ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { IStoredFile, ViewFilterMode } from '@/interfaces/filestack.interface';
import {
  getFilestackPreviewUrl,
  getFilestackTransformedUrl,
  getDownloadUrl,
} from '@/lib/filestack';

interface IFilestackViewerProps {
  file: IStoredFile;
  className?: string;
}

export const FilestackViewer: FC<IFilestackViewerProps> = ({ file, className }) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'blueprint'>('interactive');
  const [filterMode, setFilterMode] = useState<ViewFilterMode>('blueprint');
  const [rotation, setRotation] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const previewUrl = getFilestackPreviewUrl(file.handle);
  const transformedUrl = getFilestackTransformedUrl(file, {
    filter: filterMode,
    rotate: rotation,
    width: Math.min(2000, Math.round(1200 * (zoomLevel / 100))),
  });
  const downloadUrl = getDownloadUrl(file);

  const rotateNext = () => setRotation((prev) => (prev + 90) % 360);
  const zoomIn = () => setZoomLevel((prev) => Math.min(250, prev + 25));
  const zoomOut = () => setZoomLevel((prev) => Math.max(75, prev - 25));

  return (
    <div className={`card overflow-hidden ${className}`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-200 bg-brand-50 px-4 py-3 text-xs">
        <div className="flex items-center gap-2 text-brand-900 font-bold">
          <Layers className="h-4 w-4 text-accent-500" />
          <span className="truncate max-w-[200px] sm:max-w-xs">{file.filename}</span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-white p-0.5 border border-brand-200">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                viewMode === 'interactive' ? 'bg-brand-900 text-white shadow-sm' : 'text-brand-600 hover:text-brand-950'
              }`}
            >
              Interactive Preview
            </button>
            <button
              type="button"
              onClick={() => setViewMode('blueprint')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                viewMode === 'blueprint' ? 'bg-brand-900 text-white shadow-sm' : 'text-brand-600 hover:text-brand-950'
              }`}
            >
              Blueprint View
            </button>
          </div>

          {/* Blueprint Transformation Controls */}
          {viewMode === 'blueprint' && (
            <>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as ViewFilterMode)}
                className="rounded-lg border border-brand-200 bg-white px-2 py-1 text-[11px] text-brand-900 focus:outline-none focus:ring-1 focus:ring-accent-500 font-semibold"
              >
                <option value="blueprint">Blueprint Blue</option>
                <option value="grayscale">High-Contrast Gray</option>
                <option value="normal">Full Color</option>
              </select>

              <button
                type="button"
                onClick={rotateNext}
                className="p-1.5 rounded-lg border border-brand-200 bg-white text-brand-700 hover:text-accent-500 transition"
                title="Rotate 90 degrees"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={zoomOut}
                className="p-1.5 rounded-lg border border-brand-200 bg-white text-brand-700 hover:text-accent-500 transition"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>

              <span className="text-[11px] text-brand-500 font-mono w-9 text-center">{zoomLevel}%</span>

              <button
                type="button"
                onClick={zoomIn}
                className="p-1.5 rounded-lg border border-brand-200 bg-white text-brand-700 hover:text-accent-500 transition"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-[11px] py-1 px-2.5"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="relative min-h-[420px] max-h-[580px] w-full flex items-center justify-center bg-brand-950 p-2 overflow-auto">
        {viewMode === 'interactive' ? (
          <iframe
            src={previewUrl}
            className="h-[460px] w-full rounded border-0 bg-brand-900"
            title={file.filename}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <div
              className="relative overflow-hidden rounded-lg border border-cyan-500/30 p-2 shadow-2xl transition-all"
              style={{
                backgroundImage:
                  filterMode === 'blueprint'
                    ? 'radial-gradient(circle at 1px 1px, rgba(2, 132, 199, 0.2) 1px, transparent 0)'
                    : 'none',
                backgroundSize: '16px 16px',
                backgroundColor: filterMode === 'blueprint' ? '#07162c' : '#0a0a0a',
              }}
            >
              <img
                src={transformedUrl}
                alt={file.filename}
                className="max-h-[440px] object-contain rounded transition-all duration-300"
                style={{
                  filter:
                    filterMode === 'blueprint'
                      ? 'hue-rotate(180deg) invert(85%) contrast(120%)'
                      : filterMode === 'grayscale'
                      ? 'grayscale(100%) contrast(150%)'
                      : 'none',
                  transform: `scale(${zoomLevel / 100})`,
                }}
              />
            </div>
            <p className="mt-2 text-[11px] text-brand-300 font-mono flex items-center gap-1">
              <Maximize2 className="h-3 w-3 text-accent-400" /> Filestack CDN Transformation Pipeline
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
