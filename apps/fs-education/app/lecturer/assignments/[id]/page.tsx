import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/avatar";
import { DeleteAssignmentButton } from "@/components/delete-assignment-button";
import { EmptyState } from "@/components/empty-state";
import { FileCard } from "@/components/file-card";
import { FileThumb } from "@/components/file-thumb";
import { DuePill, ScorePill, StatusPill, submissionStatus } from "@/components/pills";
import {
  getAssignment,
  listAnnotations,
  listStudentsOf,
  listSubmissionsForAssignment,
} from "@/lib/data";
import { isAnnotatable } from "@/lib/filestack";
import { formatDate, formatDateTime } from "@/lib/format";
import { requireLecturer } from "@/lib/session";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const lecturer = await requireLecturer();
  const { id } = await params;

  const assignment = await getAssignment(id);
  if (!assignment || assignment.lecturerId !== lecturer.id) notFound();

  const [submissions, students, briefAnnotations] = await Promise.all([
    listSubmissionsForAssignment(assignment.id),
    listStudentsOf(lecturer.id),
    listAnnotations("assignment", assignment.id),
  ]);

  const submittedIds = new Set(submissions.map((s) => s.studentId));
  const outstanding = students.filter((s) => !submittedIds.has(s.id));
  const markedCount = submissions.filter((s) => s.score !== null).length;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/lecturer"
          className="text-sm font-semibold text-brand-400 hover:text-brand-700"
        >
          ← Back to overview
        </Link>

        <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-title">{assignment.subject}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-950">
              {assignment.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-brand-400">
              <DuePill dueDate={assignment.dueDate} />
              <span>Due {formatDate(assignment.dueDate)}</span>
              <span>{assignment.maxScore} marks</span>
              <span>Set {formatDateTime(assignment.createdAt)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/lecturer/assignments/${assignment.id}/edit`}
              className="btn-secondary"
            >
              Edit
            </Link>
            <DeleteAssignmentButton
              assignmentId={assignment.id}
              title={assignment.title}
            />
          </div>
        </header>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 sm:p-6 lg:col-span-2">
          <h2 className="section-title">The homework</h2>

          {assignment.instructions ? (
            <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-brand-700">
              {assignment.instructions}
            </p>
          ) : (
            <p className="mt-3 text-sm text-brand-400 italic">
              No typed brief — see the attached file.
            </p>
          )}

          {assignment.attachment && (
            <div className="mt-5">
              <FileCard
                file={assignment.attachment}
                caption="Attached brief"
                annotateHref={`/lecturer/assignments/${assignment.id}/annotate`}
                annotateLabel={
                  briefAnnotations.length > 0
                    ? "Edit markings"
                    : "Draw on the brief"
                }
              />
              {!isAnnotatable(assignment.attachment.mimetype) && (
                <p className="mt-2 text-xs text-brand-400">
                  Only images and PDFs can be opened in the drawing editor.
                </p>
              )}
            </div>
          )}
        </section>

        <aside className="card p-5 sm:p-6">
          <h2 className="section-title">Hand-in progress</h2>
          <p className="mt-3 text-3xl font-bold text-brand-900">
            {submissions.length}
            <span className="text-lg font-semibold text-brand-300">
              /{students.length}
            </span>
          </p>
          <p className="text-xs text-brand-400">students have handed in</p>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-500">Marked</dt>
              <dd className="font-semibold text-brand-900">{markedCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-500">Awaiting marking</dt>
              <dd className="font-semibold text-brand-900">
                {submissions.length - markedCount}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-500">Not handed in</dt>
              <dd className="font-semibold text-brand-900">
                {outstanding.length}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <section>
        <h2 className="text-lg font-bold text-brand-900">
          Submissions ({submissions.length})
        </h2>

        <div className="mt-3 space-y-3">
          {submissions.length === 0 ? (
            <EmptyState title="Nobody has handed in yet">
              Student uploads will appear here as soon as they arrive.
            </EmptyState>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="card flex flex-wrap items-center gap-4 p-4"
              >
                <Avatar
                  name={submission.student.name}
                  accent={submission.student.accent}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-brand-900">
                    {submission.student.name}
                  </p>
                  <p className="text-xs text-brand-400">
                    Handed in {formatDateTime(submission.submittedAt)}
                    {submission.file ? ` · ${submission.file.name}` : ""}
                  </p>
                  {submission.note && (
                    <p className="mt-1 line-clamp-1 text-xs text-brand-500 italic">
                      “{submission.note}”
                    </p>
                  )}
                </div>

                {submission.file && (
                  <FileThumb file={submission.file} size={48} />
                )}

                <div className="flex items-center gap-3">
                  {submission.score === null ? (
                    <StatusPill status={submissionStatus(submission)} />
                  ) : (
                    <ScorePill
                      score={submission.score}
                      maxScore={assignment.maxScore}
                    />
                  )}
                  <Link
                    href={`/lecturer/submissions/${submission.id}`}
                    className="btn-primary px-3 py-2 text-xs"
                  >
                    {submission.score === null ? "Mark work" : "Review"}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {outstanding.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-brand-900">
            Still to hand in ({outstanding.length})
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {outstanding.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-white/60 p-3.5"
              >
                <Avatar
                  name={student.name}
                  accent={student.accent}
                  size="sm"
                />
                <p className="truncate text-sm font-semibold text-brand-500">
                  {student.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
