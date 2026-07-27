import Link from "next/link";

import { AssignmentForm } from "@/components/assignment-form";
import { requireLecturer } from "@/lib/session";

export default async function NewAssignmentPage() {
  const lecturer = await requireLecturer();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/lecturer"
        className="text-sm font-semibold text-brand-400 hover:text-brand-700"
      >
        ← Back to overview
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-950">
        Add an assignment
      </h1>
      <p className="mt-1 text-sm text-brand-400">
        It appears for every student on {lecturer.course} straight away.
      </p>

      <div className="mt-6">
        <AssignmentForm defaultSubject={lecturer.course ?? ""} />
      </div>
    </div>
  );
}
