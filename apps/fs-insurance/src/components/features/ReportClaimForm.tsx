'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, FileText, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';

import { Dropzone } from '@/components/features/Dropzone';
import { reportClaim, type ActionState } from '@/lib/actions/claims';
import { cdnUrl, isImage, signedTaskSegment } from '@/lib/filestack';
import { requestSignedUrl } from '@/services/filestack.service';
import { formatBytes } from '@/lib/utils';
import { PERIL_LABELS, type Peril } from '@/interfaces/claim.interface';
import type { IOcrResult, IStoredFile } from '@/interfaces/filestack.interface';

/** A file the member has attached, plus whatever intake made of it. */
type Attached = IStoredFile & {
  state: 'reading' | 'ready';
  extractedText?: string;
  extractedReference?: string;
  /** Set when the document could not be read, so the member is told. */
  readFailed?: boolean;
};

const PERILS = Object.keys(PERIL_LABELS) as Peril[];

/** Policy numbers look like AM-0000-00 and appear on the schedule. */
function findPolicyNumber(text: string): string | undefined {
  return text.match(/AM-\d{4}-\d{2}/i)?.[0]?.toUpperCase();
}

export function ReportClaimForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(reportClaim, {});
  const [files, setFiles] = useState<Attached[]>([]);
  const [policyNumber, setPolicyNumber] = useState('');

  async function attach(uploaded: IStoredFile[]) {
    setFiles((current) => [
      ...current,
      ...uploaded.map((file) => ({ ...file, state: 'reading' as const })),
    ]);

    for (const file of uploaded) {
      let extractedText: string | undefined;
      let extractedReference: string | undefined;
      let readFailed = false;

      // Paperwork is flattened and read so the member does not have to type
      // their policy number in from the schedule.
      if (!isImage(file.mimetype) || /schedule|policy|invoice|letter|receipt/i.test(file.filename)) {
        try {
          const signed = await requestSignedUrl(file.handle, [
            signedTaskSegment({ task: 'doc_detection', coords: false, preprocess: true }),
            signedTaskSegment({ task: 'ocr' }),
          ]);
          const response = await fetch(signed);
          if (response.ok) {
            const result = (await response.json()) as IOcrResult;
            extractedText = result.text;
            extractedReference = result.text ? findPolicyNumber(result.text) : undefined;
            if (extractedReference) setPolicyNumber((current) => current || extractedReference!);
          }
        } catch (readError) {
          console.error('Could not read the document:', readError);
          readFailed = true;
        }
      }

      setFiles((current) =>
        current.map((item) =>
          item.handle === file.handle
            ? { ...item, state: 'ready', extractedText, extractedReference, readFailed }
            : item,
        ),
      );
    }
  }

  if (state.ok && state.reference) {
    return (
      <div className="card card-ruled mx-auto max-w-xl p-10 text-center">
        <CheckCircle2 className="mx-auto size-10" style={{ color: '#15803d' }} />
        <h2 className="font-display mt-4 text-2xl">Your claim is with us</h2>
        <p className="mt-3 leading-7" style={{ color: 'var(--brand-700)' }}>
          Quote <span className="font-mono font-bold">{state.reference}</span> if you call us.
          An assessor will look at it within two working days, and we will write to you at the
          address on your policy.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/admin" className="btn-primary">See it on the assessment desk</Link>
          <Link href="/demo" className="btn-secondary">Report another</Link>
        </div>
      </div>
    );
  }

  const busy = files.some((file) => file.state === 'reading');

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <input type="hidden" name="files" value={JSON.stringify(files)} />

      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="font-display text-xl">What happened</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="peril" className="label">Type of claim</label>
              <select id="peril" name="peril" required className="input mt-1.5" defaultValue="">
                <option value="" disabled>Please choose</option>
                {PERILS.map((peril) => (
                  <option key={peril} value={peril}>{PERIL_LABELS[peril]}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="incidentDate" className="label">Date it happened</label>
              <input
                id="incidentDate"
                name="incidentDate"
                type="date"
                required
                max={new Date().toISOString().slice(0, 10)}
                className="input mt-1.5"
              />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="description" className="label">Tell us about it</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              placeholder="What happened, what has been damaged, and whether anything is still causing damage now."
              className="input mt-1.5"
            />
          </div>

          <div className="mt-5 sm:w-1/2">
            <label htmlFor="estimatedValue" className="label">
              Rough value, if you know it
            </label>
            <input
              id="estimatedValue"
              name="estimatedValue"
              inputMode="decimal"
              placeholder="£"
              className="input mt-1.5"
            />
            <p className="mt-1.5 text-xs" style={{ color: 'var(--brand-500)' }}>
              An estimate is fine. It does not bind you to anything.
            </p>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-xl">Photographs and paperwork</h2>
          <p className="mt-1.5 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>
            Photographs of the damage, and a picture of your policy schedule if you have one to
            hand. Taken on a phone, at whatever angle, in whatever light.
          </p>

          <div className="mt-5">
            <Dropzone
              onFiles={(uploaded) => void attach(uploaded)}
              accept={['image/*', 'application/pdf']}
              maxFiles={6}
              label="Add photographs or documents"
              hint="You can add several at once"
            />
          </div>

          {files.length > 0 && (
            <ul className="mt-5 space-y-3">
              {files.map((file) => (
                <li key={file.handle} className="flex items-center gap-4 rounded-sm border p-3" style={{ borderColor: 'var(--brand-200)' }}>
                  <img
                    src={cdnUrl(file.handle, [
                      'enhance=preset:fix_dark',
                      'resize=width:160,height:160,fit:crop',
                      'output=format:webp',
                    ])}
                    alt=""
                    className="size-14 shrink-0 rounded-sm object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                      {isImage(file.mimetype) ? (
                        <ImageIcon className="size-3.5 shrink-0" />
                      ) : (
                        <FileText className="size-3.5 shrink-0" />
                      )}
                      {file.filename}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--brand-500)' }}>
                      {formatBytes(file.size)}
                      {file.state === 'reading' && ' · reading it now'}
                      {file.extractedReference && ` · policy ${file.extractedReference} found`}
                      {file.readFailed && ' · could not be read, please type your policy number'}
                    </p>
                  </div>
                  {file.state === 'reading' ? (
                    <Loader2 className="size-4 shrink-0 animate-spin" style={{ color: 'var(--brand-400)' }} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFiles((c) => c.filter((f) => f.handle !== file.handle))}
                      className="shrink-0 p-1.5"
                      aria-label={`Remove ${file.filename}`}
                    >
                      <Trash2 className="size-4" style={{ color: 'var(--brand-400)' }} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <aside className="space-y-5">
        <div className="card card-ruled p-6">
          <h2 className="font-display text-xl">Your policy</h2>

          <div className="mt-4">
            <label htmlFor="policyNumber" className="label">Policy number</label>
            <input
              id="policyNumber"
              name="policyNumber"
              required
              value={policyNumber}
              onChange={(event) => setPolicyNumber(event.target.value)}
              placeholder="AM-0000-00"
              className="input mt-1.5 font-mono"
            />
            <p className="mt-1.5 text-xs leading-5" style={{ color: 'var(--brand-500)' }}>
              It is on your schedule. If you attach a photograph of the schedule we will read it
              off for you.
            </p>
          </div>

          {state.error && (
            <p
              className="mt-4 rounded-sm px-3 py-2.5 text-sm font-semibold"
              style={{ background: 'rgba(190,18,60,.08)', color: '#be123c' }}
            >
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending || busy} className="btn-primary mt-5 w-full">
            {pending ? 'Sending…' : busy ? 'Reading your documents…' : 'Report this claim'}
          </button>

          <p className="mt-3 text-xs leading-5" style={{ color: 'var(--brand-500)' }}>
            Members with policies in this demonstration: AM-4471-22, AM-6620-19, AM-3318-24,
            AM-1902-08, AM-7745-21.
          </p>
        </div>
      </aside>
    </form>
  );
}
