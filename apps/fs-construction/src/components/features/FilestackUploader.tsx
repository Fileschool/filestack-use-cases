'use client';

import { FC, useState } from 'react';
import { UploadCloud, FileCheck, Trash2, Layers, AlertCircle } from 'lucide-react';
import { getFilestackClient, formatPickerMetadata } from '@/services/filestack.service';
import { IStoredFile } from '@/interfaces/filestack.interface';
import { formatBytes } from '@/lib/utils';

interface IFilestackUploaderProps {
  onFileUploaded: (file: IStoredFile) => void;
  onFileRemoved?: (handle: string) => void;
  files: IStoredFile[];
  maxFiles?: number;
}

export const FilestackUploader: FC<IFilestackUploaderProps> = ({
  onFileUploaded,
  onFileRemoved,
  files,
  maxFiles = 3,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenPicker = async () => {
    setError(null);
    setIsUploading(true);

    try {
      const client = await getFilestackClient();
      const picker = client.picker({
        accept: ['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.jpeg', '.rvt', '.skp', 'image/*', 'application/pdf'],
        maxFiles: maxFiles - files.length,
        fromSources: ['local_file_system', 'url', 'googledrive', 'dropbox'],
        onUploadDone: (res) => {
          if (res.filesUploaded && res.filesUploaded.length > 0) {
            res.filesUploaded.forEach((uploaded) => {
              onFileUploaded(formatPickerMetadata(uploaded));
            });
          }
          setIsUploading(false);
        },
        onCancel: () => setIsUploading(false),
        onFileUploadFailed: (err) => {
          console.error('Filestack upload error:', err);
          setError('That upload failed. Please try again.');
          setIsUploading(false);
        },
      });
      await picker.open();
    } catch (err) {
      console.error('Filestack picker could not be opened:', err);
      setError('The file picker could not be opened. Check your API key and try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-brand-900 uppercase tracking-wider">
          CAD Drawings & Blueprints ({files.length}/{maxFiles})
        </label>
        <span className="text-[11px] text-brand-500 font-mono">Supports .DWG, .DXF, .PDF, Images</span>
      </div>

      {files.length < maxFiles && (
        <button
          type="button"
          onClick={handleOpenPicker}
          disabled={isUploading}
          className="group relative flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-300 bg-white p-6 text-center transition hover:border-accent-500 hover:bg-accent-50/50 focus:outline-none"
        >
          <div className="rounded-full bg-accent-50 p-3 text-accent-600 group-hover:scale-110 transition">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-bold text-brand-950">
            {isUploading ? 'Opening Filestack Picker...' : 'Click to Upload CAD Files & Blueprints'}
          </p>
          <p className="mt-1 text-xs text-brand-400">
            Stored & processed with <span className="font-bold text-accent-600">Filestack CDN</span>
          </p>
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.handle || file.filename}
              className="flex items-center justify-between rounded-xl border border-brand-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600 border border-accent-100">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-brand-950">{file.filename}</p>
                  <p className="text-[11px] text-brand-400">
                    {file.mimetype} · {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="pill bg-emerald-50 text-emerald-800 ring-emerald-200 text-[11px]">
                  <FileCheck className="h-3 w-3" /> Ready
                </span>
                {onFileRemoved && (
                  <button
                    type="button"
                    onClick={() => onFileRemoved(file.handle)}
                    className="p-1.5 text-brand-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
