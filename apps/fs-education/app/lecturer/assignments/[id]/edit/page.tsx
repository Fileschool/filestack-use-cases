import Link from "next/link";
import { notFound } from "next/navigation";

import { AssignmentForm } from "@/components/assignment-form";
import { getAssignment } from "@/lib/data";
import { requireLecturer } from "@/lib/session";

export default async function EditAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const lecturer = await requireLecturer();
  const { id } = await params;

  const assignment = await getAssignment(id);
  if (!assignment || assignment.lecturerId !== lecturer.id) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/lecturer/assignments/${assignment.id}`}
        className="text-sm font-semibold text-brand-400 hover:text-brand-700"
      >
        ← Back to assignment
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-950">
        Edit assignment
      </h1>
      <p className="mt-1 text-sm text-brand-400">
        Students see the updated brief immediately.
      </p>

      <div className="mt-6">
        <AssignmentForm
          assignment={assignment}
          defaultSubject={lecturer.course ?? ""}
        />
      </div>
    </div>
  );
}
