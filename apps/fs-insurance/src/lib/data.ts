import 'server-only';

import type { Row } from '@libsql/client';

import { db } from './db';
import type {
  ClaimStatus,
  CoverType,
  IAssessor,
  IClaim,
  IClaimDetail,
  IClaimFile,
  IClaimFilters,
  IClaimSummary,
  IMember,
  Peril,
} from '@/interfaces/claim.interface';

const text = (value: unknown): string => (typeof value === 'string' ? value : '');
const nullableText = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null;
const num = (value: unknown, fallback = 0): number =>
  value === null || value === undefined ? fallback : Number(value);
const nullableNum = (value: unknown): number | null =>
  value === null || value === undefined ? null : Number(value);

function toMember(row: Row): IMember {
  return {
    id: text(row.id),
    name: text(row.name),
    email: text(row.email),
    phone: text(row.phone),
    policyNumber: text(row.policy_number),
    coverType: text(row.cover_type) as CoverType,
    address: text(row.address),
    memberSince: text(row.member_since),
  };
}

function toAssessor(row: Row): IAssessor {
  return {
    id: text(row.id),
    name: text(row.name),
    role: text(row.role),
    email: text(row.email),
  };
}

function toClaim(row: Row): IClaim {
  return {
    id: text(row.id),
    reference: text(row.reference),
    memberId: text(row.member_id),
    peril: text(row.peril) as Peril,
    incidentDate: text(row.incident_date),
    description: text(row.description),
    estimatedValue: nullableNum(row.estimated_value),
    status: text(row.status) as ClaimStatus,
    assessorId: nullableText(row.assessor_id),
    assessorNotes: text(row.assessor_notes),
    settlementAmount: nullableNum(row.settlement_amount),
    decidedAt: nullableText(row.decided_at),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
  };
}

/** The joined shape the queries below select, so the mappers can share it. */
function toSummary(row: Row): IClaimSummary {
  return {
    ...toClaim(row),
    member: {
      id: text(row.member_id),
      name: text(row.m_name),
      email: text(row.m_email),
      phone: text(row.m_phone),
      policyNumber: text(row.m_policy_number),
      coverType: text(row.m_cover_type) as CoverType,
      address: text(row.m_address),
      memberSince: text(row.m_member_since),
    },
    assessor: nullableText(row.a_id)
      ? { id: text(row.a_id), name: text(row.a_name), role: text(row.a_role), email: text(row.a_email) }
      : null,
    fileCount: num(row.file_count),
    coverPhotoHandle: nullableText(row.cover_handle),
  };
}

function toClaimFile(row: Row): IClaimFile {
  return {
    id: text(row.id),
    claimId: text(row.claim_id),
    kind: text(row.kind) as IClaimFile['kind'],
    handle: text(row.handle),
    url: text(row.url),
    filename: text(row.filename),
    mimetype: text(row.mimetype),
    size: num(row.size),
    extractedText: text(row.extracted_text),
    extractedReference: text(row.extracted_reference),
    processed: num(row.processed) === 1,
    scanResult: text(row.scan_result) as IClaimFile['scanResult'],
  };
}

const SUMMARY_SELECT = `
  SELECT c.*,
         m.name AS m_name, m.email AS m_email, m.phone AS m_phone,
         m.policy_number AS m_policy_number, m.cover_type AS m_cover_type,
         m.address AS m_address, m.member_since AS m_member_since,
         a.id AS a_id, a.name AS a_name, a.role AS a_role, a.email AS a_email,
         (SELECT COUNT(*) FROM claim_files f WHERE f.claim_id = c.id) AS file_count,
         (SELECT f.handle FROM claim_files f
            WHERE f.claim_id = c.id AND f.kind = 'damage_photo'
            ORDER BY f.created_at LIMIT 1) AS cover_handle
    FROM claims c
    JOIN members m ON m.id = c.member_id
    LEFT JOIN assessors a ON a.id = c.assessor_id
`;

export async function listClaims(filters: IClaimFilters = {}): Promise<IClaimSummary[]> {
  const client = await db();
  const where: string[] = [];
  const args: (string | number)[] = [];

  if (filters.status && filters.status !== 'all') {
    where.push('c.status = ?');
    args.push(filters.status);
  }
  if (filters.peril && filters.peril !== 'all') {
    where.push('c.peril = ?');
    args.push(filters.peril);
  }
  if (filters.search) {
    where.push('(LOWER(c.reference) LIKE ? OR LOWER(m.name) LIKE ? OR LOWER(m.policy_number) LIKE ?)');
    const term = `%${filters.search.toLowerCase()}%`;
    args.push(term, term, term);
  }

  const { rows } = await client.execute({
    sql: `${SUMMARY_SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY c.created_at DESC`,
    args,
  });

  return rows.map(toSummary);
}

export async function getClaim(id: string): Promise<IClaimDetail | null> {
  const client = await db();

  const { rows } = await client.execute({
    sql: `${SUMMARY_SELECT} WHERE c.id = ? OR c.reference = ? LIMIT 1`,
    args: [id, id.toUpperCase()],
  });
  if (rows.length === 0) return null;

  const summary = toSummary(rows[0]);
  const files = await client.execute({
    sql: 'SELECT * FROM claim_files WHERE claim_id = ? ORDER BY kind, created_at',
    args: [summary.id],
  });

  return { ...summary, files: files.rows.map(toClaimFile) };
}

export async function getMemberByPolicy(policyNumber: string): Promise<IMember | null> {
  const client = await db();
  const { rows } = await client.execute({
    sql: 'SELECT * FROM members WHERE UPPER(policy_number) = UPPER(?) LIMIT 1',
    args: [policyNumber.trim()],
  });
  return rows.length > 0 ? toMember(rows[0]) : null;
}

export async function listAssessors(): Promise<IAssessor[]> {
  const client = await db();
  const { rows } = await client.execute('SELECT * FROM assessors ORDER BY name');
  return rows.map(toAssessor);
}

/** Counts for the desk header, in one pass. */
export async function claimCounts(): Promise<Record<ClaimStatus | 'all', number>> {
  const client = await db();
  const { rows } = await client.execute('SELECT status, COUNT(*) AS n FROM claims GROUP BY status');

  const counts = {
    all: 0,
    reported: 0,
    in_assessment: 0,
    awaiting_member: 0,
    settled: 0,
    declined: 0,
  } as Record<ClaimStatus | 'all', number>;

  for (const row of rows) {
    const status = text(row.status) as ClaimStatus;
    const n = num(row.n);
    if (status in counts) counts[status] = n;
    counts.all += n;
  }

  return counts;
}

/** Money still to settle across everything open. */
export async function openExposure(): Promise<number> {
  const client = await db();
  const { rows } = await client.execute(
    `SELECT COALESCE(SUM(estimated_value), 0) AS total FROM claims
      WHERE status IN ('reported', 'in_assessment', 'awaiting_member')`,
  );
  return num(rows[0]?.total);
}
