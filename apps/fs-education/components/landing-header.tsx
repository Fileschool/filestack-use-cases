"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { FilestackMark } from "@/components/filestack-logo";
import { signInWithForm } from "@/lib/actions/auth";

export type DemoAccount = {
  id: string;
  name: string;
  email: string;
};

// Auth is emulated — a stand-in password so the form looks real. The hidden
// userId is what actually signs the person in.
const DEMO_PASSWORD = "coursework-demo";

/** Event hero CTAs fire to open the header login for a given role. */
export const OPEN_LOGIN_EVENT = "fsedu:open-login";

function LogInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary px-4 py-1.5 text-sm"
    >
      {pending ? "…" : "Log In"}
    </button>
  );
}

function LoginDropdown({
  account,
  roleLabel,
}: {
  account: DemoAccount;
  roleLabel: string;
}) {
  return (
    <div className="absolute top-full right-0 z-50 mt-3 w-72">
      {/* little caret pointing up at the trigger button */}
      <span className="absolute -top-1.5 right-6 size-3 rotate-45 rounded-[2px] bg-brand-900" />

      <div className="overflow-hidden rounded-lg border border-brand-200 bg-white shadow-xl">
        <p className="bg-brand-900 px-3 py-2 text-xs font-semibold text-white">
          {roleLabel} log in
        </p>

        <form action={signInWithForm} className="space-y-2.5 p-3">
          <input type="hidden" name="userId" value={account.id} />

          <div>
            <label
              htmlFor="fb-email"
              className="mb-0.5 block text-xs font-bold text-brand-600"
            >
              Email
            </label>
            <input
              id="fb-email"
              name="email"
              type="email"
              defaultValue={account.email}
              autoComplete="email"
              className="w-full rounded border border-brand-300 px-2 py-1.5 text-sm text-brand-900 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="fb-password"
              className="mb-0.5 block text-xs font-bold text-brand-600"
            >
              Password
            </label>
            <input
              id="fb-password"
              name="password"
              type="password"
              defaultValue={DEMO_PASSWORD}
              autoComplete="current-password"
              className="w-full rounded border border-brand-300 px-2 py-1.5 text-sm text-brand-900 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-1.5 text-xs text-brand-500">
              <input
                type="checkbox"
                defaultChecked
                className="size-3.5 rounded-sm border-brand-300"
              />
              Keep me logged in
            </label>
            <LogInButton />
          </div>

          <p className="border-t border-brand-100 pt-2 text-[11px] text-brand-400">
            Demo login — pre-filled, just press Log In.
          </p>
        </form>
      </div>
    </div>
  );
}

export function LandingHeader({
  teacher,
  student,
}: {
  teacher: DemoAccount;
  student: DemoAccount;
}) {
  const [open, setOpen] = useState<null | "teacher" | "student">(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Let CTA buttons elsewhere on the page open this login.
  useEffect(() => {
    function onOpen(event: Event) {
      const role = (event as CustomEvent).detail;
      if (role === "teacher" || role === "student") {
        setOpen(role);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    window.addEventListener(OPEN_LOGIN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_LOGIN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }

    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(role: "teacher" | "student") {
    setOpen((current) => (current === role ? null : role));
  }

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <span className="flex items-center gap-2.5">
          <FilestackMark className="size-9 rounded-lg" />
          <span className="leading-tight">
            <span className="block text-sm font-bold text-brand-900">
              Fairmount College
            </span>
            <span className="block text-xs text-brand-400">
              Coursework portal
            </span>
          </span>
        </span>

        <div ref={menuRef} className="relative ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggle("student")}
            aria-expanded={open === "student"}
            className="btn-secondary"
          >
            Student login
          </button>
          <button
            type="button"
            onClick={() => toggle("teacher")}
            aria-expanded={open === "teacher"}
            className="btn-primary"
          >
            Lecturer login
          </button>

          {open === "student" && (
            <LoginDropdown account={student} roleLabel="Student" />
          )}
          {open === "teacher" && (
            <LoginDropdown account={teacher} roleLabel="Lecturer" />
          )}
        </div>
      </div>
    </header>
  );
}
