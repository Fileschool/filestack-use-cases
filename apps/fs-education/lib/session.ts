import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUser } from "./data";
import type { User } from "./types";

const SESSION_COOKIE = "fs_edu_user";

/**
 * Logins are emulated: picking a person on the sign-in screen stores their id
 * in a cookie. There are no passwords — this is a demo of the Filestack
 * workflow, not of authentication.
 */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return getUser(id);
}

export async function signIn(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the signed-in lecturer, or sends the visitor back to sign in. */
export async function requireLecturer(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role !== "lecturer") redirect("/student");
  return user;
}

/** Returns the signed-in student, or sends the visitor back to sign in. */
export async function requireStudent(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role !== "student") redirect("/lecturer");
  return user;
}

export function homeFor(user: User): string {
  return user.role === "lecturer" ? "/lecturer" : "/student";
}
