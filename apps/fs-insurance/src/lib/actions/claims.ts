'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { getMemberByPolicy } from '@/lib/data';
import { requireAssessor } from '@/lib/session';
import type { ClaimStatus, Peril } from '@/interfaces/claim.interface';

export type ActionState = { error?: string; ok?: boolean; reference?: string };

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
}

/** Sequential-looking reference, which is what a member will quote on the phone. */
async function nextReference(): Promise<string> {
  const client = await db();
  const { rows } = await client.execute('SELECT COUNT(*) AS n FROM claims');
  return `CLM-${8842 + Number(rows[0]?.n ?? 0)}`;
}

type UploadedFile = {
  handle: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  extractedText?: string;
  extractedReference?: string;
};

/**
 * A member reports a claim. The files have already gone to Filestack from the
 * browser; what arrives here is the metadata plus whatever intake read off them.
 */
export async function reportClaim(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const policyNumber = String(formData.get('policyNumber') ?? '').trim();
  const peril = String(formData.get('peril') ?? '').trim() as Peril;
  const incidentDate = String(formData.get('incidentDate') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const rawValue = String(formData.get('estimatedValue') ?? '').trim();

  let files: UploadedFile[] = [];
  try {
    const parsed = JSON.parse(String(formData.get('files') ?? '[]')) as UploadedFile[];
    if (Array.isArray(parsed)) files = parsed;
  } catch {
    return { error: 'Those attachments could not be read. Please try again.' };
  }

  if (!policyNumber) return { error: 'Please give your policy number.' };
  if (!peril) return { error: 'Please tell us what happened.' };
  if (!incidentDate) return { error: 'Please give the date of the incident.' };
  if (description.length < 20) {
    return { error: 'Please describe what happened in a little more detail.' };
  }
  if (files.length === 0) {
    return { error: 'Please attach at least one photograph or document.' };
  }

  const member = await getMemberByPolicy(policyNumber);
  if (!member) {
    return {
      error:
        'We could not find that policy number. It looks like AM-0000-00 and is on your schedule.',
    };
  }

  const estimatedValue = rawValue.length > 0 ? Number(rawValue.replace(/[^\d.]/g, '')) : null;
  if (estimatedValue !== null && !Number.isFinite(estimatedValue)) {
    return { error: 'The estimated value should be a number.' };
  }

  const client = await db();
  const id = newId('clm');
  const reference = await nextReference();

  await client.execute({
    sql: `INSERT INTO claims (id, reference, member_id, peril, incident_date, description,
            estimated_value, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'reported')`,
    args: [id, reference, member.id, peril, incidentDate, description, estimatedValue],
  });

  for (const [index, file] of files.entries()) {
    await client.execute({
      sql: `INSERT INTO claim_files (id, claim_id, kind, handle, url, filename, mimetype, size,
              extracted_text, extracted_reference, processed, scan_result)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'clean')`,
      args: [
        `${id}_f${index}`,
        id,
        file.mimetype.startsWith('image/') && !file.extractedReference ? 'damage_photo' : 'document',
        file.handle,
        file.url,
        file.filename,
        file.mimetype,
        file.size,
        file.extractedText ?? '',
        file.extractedReference ?? '',
      ],
    });
  }

  revalidatePath('/admin');
  return { ok: true, reference };
}

/** An assessor records a decision. This is the work the desk exists to do. */
export async function assessClaim(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const assessor = await requireAssessor();

  const claimId = String(formData.get('claimId') ?? '').trim();
  const status = String(formData.get('status') ?? '').trim() as ClaimStatus;
  const notes = String(formData.get('assessorNotes') ?? '').trim();
  const rawSettlement = String(formData.get('settlementAmount') ?? '').trim();

  const allowed: ClaimStatus[] = [
    'reported',
    'in_assessment',
    'awaiting_member',
    'settled',
    'declined',
  ];
  if (!claimId || !allowed.includes(status)) {
    return { error: 'That decision could not be recorded.' };
  }

  let settlement: number | null = null;
  if (status === 'settled') {
    if (rawSettlement.length === 0) {
      return { error: 'A settled claim needs a settlement figure.' };
    }
    settlement = Number(rawSettlement.replace(/[^\d.]/g, ''));
    if (!Number.isFinite(settlement) || settlement < 0) {
      return { error: 'The settlement figure should be a number of 0 or more.' };
    }
  }
  if (status === 'declined' && notes.length < 15) {
    return { error: 'A declined claim needs a reason the member can be told.' };
  }

  const decided = status === 'settled' || status === 'declined';
  const client = await db();

  await client.execute({
    sql: `UPDATE claims
             SET status = ?, assessor_id = ?, assessor_notes = ?, settlement_amount = ?,
                 decided_at = CASE WHEN ? THEN datetime('now') ELSE NULL END,
                 updated_at = datetime('now')
           WHERE id = ?`,
    args: [status, assessor.id, notes, settlement, decided ? 1 : 0, claimId],
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/claims/${claimId}`);
  return { ok: true };
}
