import { SiteHeader } from "@/components/site-header";
import { requireStudent } from "@/lib/session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await requireStudent();

  return (
    <>
      <SiteHeader user={student} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </>
  );
}
