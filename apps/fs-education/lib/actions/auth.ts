"use server";

import { redirect } from "next/navigation";

import { getUser } from "@/lib/data";
import { homeFor, signIn, signOut } from "@/lib/session";

export async function signInAs(userId: string): Promise<void> {
  const user = await getUser(userId);
  if (!user) redirect("/");

  await signIn(user.id);
  redirect(homeFor(user));
}

/** Form variant so the sign-in cards work without JavaScript. */
export async function signInWithForm(formData: FormData): Promise<void> {
  await signInAs(String(formData.get("userId") ?? ""));
}

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect("/");
}
