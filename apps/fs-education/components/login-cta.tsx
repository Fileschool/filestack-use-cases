"use client";

import { OPEN_LOGIN_EVENT } from "@/components/landing-header";

/** A button that opens the header login dropdown for the given role. */
export function LoginCta({
  role,
  className,
  children,
}: {
  role: "teacher" | "student";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent(OPEN_LOGIN_EVENT, { detail: role }))
      }
      className={className}
    >
      {children}
    </button>
  );
}
