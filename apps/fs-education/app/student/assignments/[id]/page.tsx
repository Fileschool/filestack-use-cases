import Link from "next/link";
import { notFound } from "next/navigation";

import { AnnotatedPages } from "@/components/annotated-pages";
import { Avatar } from "@/components/avatar";
import { FileCard } from "@/components/file-card";
import { DuePill, ScorePill, StatusPill, submissionStatus } from "@/components/pills";
import { SubmissionForm } from "@/components/submission-form";
import {
  getAssignment,
  getSubmissionForStudent,
  getUser,
  listAnnotations,
} from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/format";
import { requireStudent } from "@/lib/session";

export default async function StudentAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const student = await requireStudent();
  const { id } = await params;

  const assignment = await getAssignment(id);
  if (!assignment || assignment.lecturerId !== student.lecturerId) notFound();

  const [submission, lecturer] = await Promise.all([
    getSubmissionForStudent(assignment.id, student.id),
    student.lecturerId ? getUser(student.lecturerId) : Promise.resolve(null),
  ]);

  const annotations = submission
    ? await listAnnotations("submission", submission.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/student"
          className="text-sm font-semibold text-brand-400 hover:text-brand-700"
        >
          ← Back to my coursework
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
              {lecturer && (
                <span className="flex items-center gap-1.5">
                  <Avatar
                    name={lecturer.name}
                    accent={lecturer.accent}
                    size="sm"
                  />
                  Set by {lecturer.title} {lecturer.name}
                </span>
              )}
            </div>
          </div>
          <StatusPill status={submissionStatus(submission)} />
        </header>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-5 sm:p-6">
            <h2 className="section-title">The homework</h2>
            {assignment.instructions ? (
              <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-brand-700">
                {assignment.instructions}
              </p>
            ) : (
              <p className="mt-3 text-sm text-brand-400 italic">
                Everything you need is in the attached file.
              </p>
            )}

            {assignment.attachment && (
              <div className="mt-5">
                <FileCard file={assignment.attachment} caption="Attached brief" />
              </div>
            )}
          </section>

          {submission?.score !== null && submission && (
            <section className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="section-title">Your result</h2>
                <ScorePill
                  score={submission.score!}
                  maxScore={assignment.maxScore}
                />
              </div>

              {submission.feedback ? (
                <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm leading-7 whitespace-pre-wrap text-brand-700">
                  {submission.feedback}
                </p>
              ) : (
                <p className="mt-4 text-sm text-brand-400 italic">
                  No written comments were left.
                </p>
              )}

              <p className="mt-2 text-xs text-brand-400">
                Marked {formatDateTime(submission.gradedAt)}
              </p>

              {submission.file && annotations.length > 0 && (
                <div className="mt-5">
                  <h3 className="section-title">Marked pages</h3>
                  <div className="mt-3">
                    <AnnotatedPages
                      file={submission.file}
                      annotations={annotations}
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          <SubmissionForm
            assignmentId={assignment.id}
            submission={submission}
          />
        </div>

        <aside className="lg:sticky lg:top-[4.5rem] lg:self-start">
          <div className="card p-5">
            <h2 className="section-title">Your submission</h2>

            {submission ? (
              <div className="mt-3 space-y-3">
                {submission.file && (
                  <FileCard file={submission.file} caption="Handed in" />
                )}
                <p className="text-xs text-brand-400">
                  Uploaded {formatDateTime(submission.submittedAt)}
                </p>
                {submission.note && (
                  <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-600 italic">
                    “{submission.note}”
                  </p>
                )}
                {submission.score === null && (
                  <p className="text-xs font-semibold text-accent-600">
                    Waiting to be marked.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-brand-400">
                You have not handed anything in yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
