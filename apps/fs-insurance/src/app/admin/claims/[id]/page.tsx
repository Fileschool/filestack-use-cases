import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';

import { AssessmentPanel } from '@/components/features/AssessmentPanel';
import { DeskChrome } from '@/components/ui/DeskChrome';
import { PerilPill, StatusPill } from '@/components/ui/ClaimPills';
import { getClaim } from '@/lib/data';
import { requireAssessor } from '@/lib/session';
import { cdnUrl, downloadUrl } from '@/lib/filestack';
import { formatBytes } from '@/lib/utils';
import { money, shortDate, sinceDays } from '@/lib/format';
import { COVER_LABELS } from '@/interfaces/claim.interface';

export default async function ClaimPage({ params }: { params: Promise<{ id: string }> }) {
  const assessor = await requireAssessor();
  const { id } = await params;

  const claim = await getClaim(id);
  if (!claim) notFound();

  const photos = claim.files.filter((f) => f.kind === 'damage_photo');
  const documents = claim.files.filter((f) => f.kind === 'document');

  return (
    <DeskChrome assessor={assessor}>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <Link href="/admin" className="text-sm font-semibold" style={{ color: 'var(--brand-600)' }}>
          ← Back to the desk
        </Link>

        <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl">{claim.reference}</h1>
              <StatusPill status={claim.status} />
              <PerilPill peril={claim.peril} />
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--brand-600)' }}>
              Incident {shortDate(claim.incidentDate)} · reported {sinceDays(claim.createdAt)}
              {claim.assessor ? ` · assigned to ${claim.assessor.name}` : ' · unassigned'}
            </p>
          </div>
          <div className="text-right">
            <p className="label">{claim.status === 'settled' ? 'Settled at' : 'Member estimate'}</p>
            <p className="font-display text-4xl">
              {money(claim.status === 'settled' ? claim.settlementAmount : claim.estimatedValue)}
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-8">
            {/* What the member told us */}
            <section className="card p-6">
              <h2 className="label">What happened</h2>
              <p className="mt-3 leading-7">{claim.description}</p>
            </section>

            {/* Photographs, brightened on the way through */}
            {photos.length > 0 && (
              <section>
                <h2 className="font-display flex items-center gap-2 text-xl">
                  <ImageIcon className="size-5" style={{ color: 'var(--accent-dark)' }} />
                  Photographs
                </h2>
                <p className="mt-1.5 text-sm" style={{ color: 'var(--brand-600)' }}>
                  Brightened automatically on the way in, so a photograph taken at night is
                  still assessable.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {photos.map((file) => (
                    <figure key={file.id} className="card overflow-hidden">
                      <img
                        src={cdnUrl(file.handle, [
                          'enhance=preset:fix_dark',
                          'resize=width:900,fit:max',
                          'output=format:webp',
                        ])}
                        alt={file.filename}
                        className="block w-full"
                      />
                      <figcaption className="flex items-center gap-2 px-4 py-3 text-xs" style={{ color: 'var(--brand-600)' }}>
                        <span className="truncate">{file.filename}</span>
                        <span className="ml-auto shrink-0">{formatBytes(file.size)}</span>
                        <a href={downloadUrl(file)} target="_blank" rel="noreferrer" className="shrink-0 underline">
                          Original
                        </a>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Paperwork, flattened and read */}
            {documents.length > 0 && (
              <section>
                <h2 className="font-display flex items-center gap-2 text-xl">
                  <FileText className="size-5" style={{ color: 'var(--accent-dark)' }} />
                  Paperwork
                </h2>
                <p className="mt-1.5 text-sm" style={{ color: 'var(--brand-600)' }}>
                  Straightened and read on the way in. The policy number below was lifted from
                  the document, not typed by anyone.
                </p>
                <div className="mt-4 space-y-4">
                  {documents.map((file) => (
                    <article key={file.id} className="card grid gap-5 p-5 sm:grid-cols-[13rem_minmax(0,1fr)]">
                      <img
                        src={cdnUrl(file.handle, [
                          'resize=width:460,height:600,fit:crop',
                          'output=format:webp',
                        ])}
                        alt={file.filename}
                        className="w-full rounded-sm object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{file.filename}</p>
                        <p className="mt-0.5 text-xs" style={{ color: 'var(--brand-500)' }}>
                          {file.mimetype} · {formatBytes(file.size)}
                        </p>

                        {file.extractedReference && (
                          <p className="mt-3">
                            <span className="label">Policy number read from this document</span>
                            <span className="font-mono mt-1 block text-lg font-bold">
                              {file.extractedReference}
                            </span>
                          </p>
                        )}

                        {file.extractedText && (
                          <pre
                            className="mt-3 max-h-40 overflow-auto rounded-sm p-3 text-[11px] leading-5 whitespace-pre-wrap"
                            style={{ background: 'var(--paper-sunk)', color: 'var(--brand-700)' }}
                          >
                            {file.extractedText}
                          </pre>
                        )}

                        <p className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: '#15803d' }}>
                          <ShieldCheck className="size-3.5" /> Screened on arrival
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {claim.assessorNotes && (
              <section className="card p-6">
                <h2 className="label">Assessor notes</h2>
                <p className="mt-3 leading-7 whitespace-pre-wrap">{claim.assessorNotes}</p>
                {claim.decidedAt && (
                  <p className="mt-3 text-xs" style={{ color: 'var(--brand-500)' }}>
                    Decided {shortDate(claim.decidedAt)}
                  </p>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="label">Member</h2>
              <p className="font-display mt-2 text-xl">{claim.member.name}</p>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ['Policy', claim.member.policyNumber],
                  ['Cover', COVER_LABELS[claim.member.coverType]],
                  ['Member since', shortDate(claim.member.memberSince)],
                  ['Telephone', claim.member.phone],
                  ['Address', claim.member.address],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs" style={{ color: 'var(--brand-500)' }}>{label}</dt>
                    <dd className="leading-6">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <AssessmentPanel claim={claim} />
          </aside>
        </div>
      </div>
    </DeskChrome>
  );
}
