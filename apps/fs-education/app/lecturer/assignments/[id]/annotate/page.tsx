import Link from "next/link";
import { notFound } from "next/navigation";

import { AnnotationEditor } from "@/components/annotation-editor";
import { getAssignment, listAnnotations } from "@/lib/data";
import { getPdfPageCount, isAnnotatable, isPdf } from "@/lib/filestack";
import { requireLecturer } from "@/lib/session";

export default async function AnnotateBriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const lecturer = await requireLecturer();
  const { id } = await params;

  const assignment = await getAssignment(id);
  if (!assignment || assignment.lecturerId !== lecturer.id) notFound();

  const file = assignment.attachment;
  if (!file || !isAnnotatable(file.mimetype)) notFound();

  const [annotations, pageCount] = await Promise.all([
    listAnnotations("assignment", assignment.id),
    isPdf(file.mimetype) ? getPdfPageCount(file.handle) : Promise.resolve(1),
  ]);

  const backHref = `/lecturer/assignments/${assignment.id}`;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={backHref}
          className="text-sm font-semibold text-brand-400 hover:text-brand-700"
        >
          ← Back to assignment
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-brand-950">
          Mark up the brief
        </h1>
        <p className="mt-1 text-sm text-brand-400">
          {assignment.title} · {file.name}. Annotations here are for your own
          copy of the brief — student work is marked from the submissions list.
        </p>
      </div>

      <AnnotationEditor
        file={file}
        pageCount={pageCount}
        annotations={annotations}
        backHref={backHref}
        assignmentId={assignment.id}
      />
    </div>
  );
}
