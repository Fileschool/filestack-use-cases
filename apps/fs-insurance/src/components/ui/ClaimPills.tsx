import {
  PERIL_LABELS,
  STATUS_LABELS,
  type ClaimStatus,
  type Peril,
} from '@/interfaces/claim.interface';

const STATUS_TONE: Record<ClaimStatus, { bg: string; fg: string }> = {
  reported: { bg: 'rgba(176,125,43,.14)', fg: '#8d6220' },
  in_assessment: { bg: 'rgba(31,77,128,.12)', fg: '#1f4d80' },
  awaiting_member: { bg: 'rgba(120,113,108,.14)', fg: '#57534e' },
  settled: { bg: 'rgba(21,128,61,.12)', fg: '#15803d' },
  declined: { bg: 'rgba(190,18,60,.1)', fg: '#be123c' },
};

export function StatusPill({ status }: { status: ClaimStatus }) {
  const tone = STATUS_TONE[status];
  return (
    <span className="pill" style={{ background: tone.bg, color: tone.fg }}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PerilPill({ peril }: { peril: Peril }) {
  return (
    <span className="pill" style={{ background: 'var(--brand-100)', color: 'var(--brand-700)' }}>
      {PERIL_LABELS[peril]}
    </span>
  );
}
