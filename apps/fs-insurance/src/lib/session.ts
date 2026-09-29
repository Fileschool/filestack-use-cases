import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { db } from './db';
import type { IAssessor } from '@/interfaces/claim.interface';

const SESSION_COOKIE = 'ardmore_assessor';

/**
 * Sign-in is emulated: picking an assessor stores their id in a cookie. There
 * are no passwords. This demonstrates the claims workflow, not authentication.
 */
export async function getCurrentAssessor(): Promise<IAssessor | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;

  const client = await db();
  const { rows } = await client.execute({
    sql: 'SELECT * FROM assessors WHERE id = ? LIMIT 1',
    args: [id],
  });
  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: String(row.id),
    name: String(row.name),
    role: String(row.role),
    email: String(row.email),
  };
}

export async function signIn(assessorId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, assessorId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the signed-in assessor, or sends the visitor to sign in. */
export async function requireAssessor(): Promise<IAssessor> {
  const assessor = await getCurrentAssessor();
  if (!assessor) redirect('/login');
  return assessor;
}
