import Link from "next/link";
import { notFound } from "next/navigation";

import { AnnotationEditor } from "@/components/annotation-editor";
import { Avatar } from "@/components/avatar";
import { FileCard } from "@/components/file-card";
import { GradeForm } from "@/components/grade-form";
import { DuePill } from "@/components/pills";
import {
  getAssignment,
  getSubmission,
  getUser,
  listAnnotations,
} from "@/lib/data";
import { getPdfPageCount, isAnnotatable, isPdf } from "@/lib/filestack";
import { formatDateTime } from "@/lib/format";
import { requireLecturer } from "@/lib/session";

export default async function MarkSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const lecturer = await requireLecturer();
  const { id } = await params;

  const submission = await getSubmission(id);
  if (!submission) notFound();

  const [assignment, student, annotations] = await Promise.all([
    getAssignment(submission.assignmentId),
    getUser(submission.studentId),
    listAnnotations("submission", submission.id),
  ]);

  if (!assignment || assignment.lecturerId !== lecturer.id || !student) {
    notFound();
  }

  const backHref = `/lecturer/assignments/${assignment.id}`;
  const file = submission.file;
  const annotatable = file ? isAnnotatable(file.mimetype) : false;
  const pageCount =
    file && isPdf(file.mimetype) ? await getPdfPageCount(file.handle) : 1;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={backHref}
          className="text-sm font-semibold text-brand-400 hover:text-brand-700"
        >
          ← Back to {assignment.title}
        </Link>

        <header className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={student.name} accent={student.accent} size="lg" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-950">
                {student.name}
              </h1>
              <p className="text-sm text-brand-400">
                {assignment.title} · handed in{" "}
                {formatDateTime(submission.submittedAt)}
                {file ? ` · ${file.name}` : ""}
              </p>
            </div>
          </div>
          <DuePill dueDate={assignment.dueDate} />
        </header>

        {submission.note && (
          <p className="mt-4 rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-600 italic">
            “{submission.note}”
          </p>
        )}
      </div>

      {file && annotatable ? (
        <AnnotationEditor
          file={file}
          pageCount={pageCount}
          annotations={annotations}
          backHref={backHref}
          marking={{
            submissionId: submission.id,
            studentName: student.name,
            maxScore: assignment.maxScore,
            score: submission.score,
            feedback: submission.feedback,
          }}
        />
      ) : (
        <div className="space-y-4">
          {file ? (
            <FileCard file={file} caption="Submitted work" />
          ) : (
            <p className="text-sm text-brand-400">No file was attached.</p>
          )}
          <p className="text-sm text-brand-400">
            This file type cannot be drawn on. Open it above, then record the
            score and comments here.
          </p>
          <GradeForm
            submissionId={submission.id}
            maxScore={assignment.maxScore}
            initialScore={submission.score}
            initialFeedback={submission.feedback}
            backHref={backHref}
          />
        </div>
      )}
    </div>
  );
}
