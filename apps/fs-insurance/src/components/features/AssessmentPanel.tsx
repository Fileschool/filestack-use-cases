'use client';

import { useActionState, useState } from 'react';

import { assessClaim, type ActionState } from '@/lib/actions/claims';
import { STATUS_LABELS, type ClaimStatus, type IClaimDetail } from '@/interfaces/claim.interface';

const CHOICES: ClaimStatus[] = [
  'in_assessment',
  'awaiting_member',
  'settled',
  'declined',
];

/** Where the assessor actually does the job. */
export function AssessmentPanel({ claim }: { claim: IClaimDetail }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(assessClaim, {});
  const [status, setStatus] = useState<ClaimStatus>(
    claim.status === 'reported' ? 'in_assessment' : claim.status,
  );

  return (
    <form action={formAction} className="card card-ruled p-6">
      <input type="hidden" name="claimId" value={claim.id} />

      <h2 className="font-display text-xl">Decision</h2>
      <p className="mt-1.5 text-sm leading-6" style={{ color: 'var(--brand-600)' }}>
        Recording a decision assigns the claim to you.
      </p>

      <fieldset className="mt-5">
        <legend className="label">Move this claim to</legend>
        <div className="mt-2 grid gap-2">
          {CHOICES.map((choice) => (
            <label
              key={choice}
              className="flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2.5 text-sm transition"
              style={{
                borderColor: status === choice ? 'var(--brand-800)' : 'var(--brand-200)',
                background: status === choice ? 'var(--brand-50)' : '#fff',
              }}
            >
              <input
                type="radio"
                name="status"
                value={choice}
                checked={status === choice}
                onChange={() => setStatus(choice)}
              />
              <span className="font-semibold">{STATUS_LABELS[choice]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {status === 'settled' && (
        <div className="mt-5">
          <label htmlFor="settlementAmount" className="label">Settlement figure</label>
          <input
            id="settlementAmount"
            name="settlementAmount"
            inputMode="decimal"
            defaultValue={claim.settlementAmount ?? ''}
            placeholder={claim.estimatedValue ? String(claim.estimatedValue) : '0'}
            className="input mt-1.5"
          />
          <p className="mt-1.5 text-xs" style={{ color: 'var(--brand-500)' }}>
            Member estimated {claim.estimatedValue ? `£${claim.estimatedValue.toLocaleString()}` : 'nothing'}.
          </p>
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="assessorNotes" className="label">
          Notes{status === 'declined' ? ' (the member will be told this)' : ''}
        </label>
        <textarea
          id="assessorNotes"
          name="assessorNotes"
          rows={5}
          defaultValue={claim.assessorNotes}
          placeholder={
            status === 'declined'
              ? 'Why the claim is not covered, in terms the member can act on…'
              : 'What you have done and what happens next…'
          }
          className="input mt-1.5"
        />
      </div>

      {state.error && (
        <p className="mt-4 rounded-sm px-3 py-2.5 text-sm font-semibold"
           style={{ background: 'rgba(190,18,60,.08)', color: '#be123c' }}>
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p className="mt-4 rounded-sm px-3 py-2.5 text-sm font-semibold"
           style={{ background: 'rgba(21,128,61,.1)', color: '#15803d' }}>
          Recorded. The member has been notified.
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary mt-5 w-full">
        {pending ? 'Recording…' : 'Record decision'}
      </button>
    </form>
  );
}
