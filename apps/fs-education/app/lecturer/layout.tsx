import type { Metadata } from "next";
import { noindex } from "@repo/seo";
import { SiteHeader } from "@/components/site-header";
import { requireLecturer } from "@/lib/session";

/** Signed-in screens stay out of search results. */
export const metadata: Metadata = noindex;

export default async function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lecturer = await requireLecturer();

  return (
    <>
      <SiteHeader user={lecturer} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </>
  );
}
