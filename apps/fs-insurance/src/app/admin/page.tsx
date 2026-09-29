import Link from 'next/link';
import { ArrowRight, Inbox } from 'lucide-react';

import { DeskChrome } from '@/components/ui/DeskChrome';
import { PerilPill, StatusPill } from '@/components/ui/ClaimPills';
import { claimCounts, listClaims, openExposure } from '@/lib/data';
import { requireAssessor } from '@/lib/session';
import { cdnUrl } from '@/lib/filestack';
import { money, shortDate, sinceDays } from '@/lib/format';
import { COVER_LABELS, STATUS_LABELS, type ClaimStatus } from '@/interfaces/claim.interface';

const TABS: (ClaimStatus | 'all')[] = [
  'all',
  'reported',
  'in_assessment',
  'awaiting_member',
  'settled',
  'declined',
];

export default async function DeskPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const assessor = await requireAssessor();
  const params = await searchParams;
  const status = (params.status ?? 'all') as ClaimStatus | 'all';

  const [claims, counts, exposure] = await Promise.all([
    listClaims({ status, search: params.q }),
    claimCounts(),
    openExposure(),
  ]);

  return (
    <DeskChrome assessor={assessor}>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">Assessment desk</h1>
            <p className="mt-2 max-w-2xl leading-7" style={{ color: 'var(--brand-700)' }}>
              Claims that have been through intake. Paperwork is already straightened and
              read, photographs already corrected, so the first thing you do is decide.
            </p>
          </div>
          <Link href="/demo" className="btn-secondary shrink-0">
            Member reporting view
          </Link>
        </div>

        {/* What the desk is carrying */}
        <div className="mt-8 grid gap-px overflow-hidden rounded-sm sm:grid-cols-4" style={{ background: 'var(--brand-200)' }}>
          {[
            { label: 'Open claims', value: String(counts.reported + counts.in_assessment + counts.awaiting_member) },
            { label: 'Awaiting first look', value: String(counts.reported) },
            { label: 'Open exposure', value: money(exposure) },
            { label: 'Settled this period', value: String(counts.settled) },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-5 py-6">
              <p className="font-display text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--brand-600)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter by where a claim has got to */}
        <div className="mt-8 flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: 'var(--brand-200)' }}>
          {TABS.map((tab) => {
            const active = tab === status;
            return (
              <Link
                key={tab}
                href={tab === 'all' ? '/admin' : `/admin?status=${tab}`}
                className="rounded-sm px-3 py-1.5 text-sm font-semibold transition"
                style={{
                  background: active ? 'var(--brand-900)' : 'transparent',
                  color: active ? '#fff' : 'var(--brand-600)',
                }}
              >
                {tab === 'all' ? 'All' : STATUS_LABELS[tab]}
                <span className="ml-1.5 opacity-60">{counts[tab]}</span>
              </Link>
            );
          })}
        </div>

        {claims.length === 0 ? (
          <div className="card mt-8 flex flex-col items-center gap-3 p-16 text-center">
            <Inbox className="size-8" style={{ color: 'var(--brand-300)' }} />
            <p className="text-sm" style={{ color: 'var(--brand-600)' }}>
              Nothing in this queue.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {claims.map((claim) => (
              <Link
                key={claim.id}
                href={`/admin/claims/${claim.id}`}
                className="card block overflow-hidden"
              >
                <div className="grid gap-5 p-5 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
                  {claim.coverPhotoHandle ? (
                    <img
                      src={cdnUrl(claim.coverPhotoHandle, [
                        'enhance=preset:fix_dark',
                        'resize=width:280,height:220,fit:crop',
                        'output=format:webp',
                      ])}
                      alt=""
                      className="h-24 w-28 rounded-sm object-cover"
                    />
                  ) : (
                    <div
                      className="grid h-24 w-28 place-items-center rounded-sm text-[10px] tracking-wider uppercase"
                      style={{ background: 'var(--brand-100)', color: 'var(--brand-500)' }}
                    >
                      Documents
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold">{claim.reference}</span>
                      <StatusPill status={claim.status} />
                      <PerilPill peril={claim.peril} />
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {claim.member.name}{' '}
                      <span className="font-normal" style={{ color: 'var(--brand-500)' }}>
                        · {claim.member.policyNumber} · {COVER_LABELS[claim.member.coverType]}
                      </span>
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>
                      {claim.description}
                    </p>
                    <p className="mt-2 text-xs" style={{ color: 'var(--brand-500)' }}>
                      Incident {shortDate(claim.incidentDate)} · reported {sinceDays(claim.createdAt)} ·{' '}
                      {claim.fileCount} file{claim.fileCount === 1 ? '' : 's'}
                      {claim.assessor ? ` · ${claim.assessor.name}` : ' · unassigned'}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="label">
                      {claim.status === 'settled' ? 'Settled' : 'Estimate'}
                    </p>
                    <p className="font-display mt-1 text-2xl">
                      {money(claim.status === 'settled' ? claim.settlementAmount : claim.estimatedValue)}
                    </p>
                    <span
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: 'var(--brand-700)' }}
                    >
                      Open <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DeskChrome>
  );
}
