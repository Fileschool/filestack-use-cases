"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/avatar";
import { FilestackMark } from "@/components/filestack-logo";
import { signOutAction } from "@/lib/actions/auth";
import { displayName } from "@/lib/format";
import type { User } from "@/lib/types";

const NAV: Record<User["role"], { href: string; label: string }[]> = {
  lecturer: [
    { href: "/lecturer", label: "Overview" },
    { href: "/lecturer/assignments/new", label: "New assignment" },
  ],
  student: [{ href: "/student", label: "My coursework" }],
};

export function SiteHeader({ user }: { user: User }) {
  const pathname = usePathname();
  const links = NAV[user.role];

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href={user.role === "lecturer" ? "/lecturer" : "/student"}
          className="flex items-center gap-3"
        >
          <FilestackMark className="size-10" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold text-brand-900">
              Fairmount College
            </span>
            <span className="block text-xs text-brand-400">
              Coursework · powered by{" "}
              <span className="font-semibold text-accent-600">Filestack</span>
            </span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/lecturer" &&
                link.href !== "/student" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-50 text-brand-800"
                    : "text-brand-500 hover:bg-brand-50 hover:text-brand-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 border-l border-brand-100 pl-3">
          <div className="hidden text-right leading-tight sm:block">
            <span className="block text-sm font-semibold text-brand-900">
              {displayName(user)}
            </span>
            <span className="block text-xs text-brand-400 capitalize">
              {user.role}
            </span>
          </div>
          <Avatar name={user.name} accent={user.accent} size="sm" />
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg px-2.5 py-2 text-xs font-semibold text-brand-400 transition hover:bg-brand-50 hover:text-brand-800"
            >
              Switch user
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
