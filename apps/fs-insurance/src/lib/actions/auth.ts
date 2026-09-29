'use server';

import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/lib/session';

export async function signInAs(formData: FormData): Promise<void> {
  const id = String(formData.get('assessorId') ?? '').trim();
  if (!id) redirect('/login');

  await signIn(id);
  redirect('/admin');
}

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect('/');
}
