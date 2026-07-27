import Link from "next/link";

import { Avatar } from "@/components/avatar";
import { EmptyState } from "@/components/empty-state";
import { DuePill, ScorePill, StatusPill, submissionStatus } from "@/components/pills";
import { StatTile } from "@/components/stat-tile";
import { getUser, listAssignmentsForStudent } from "@/lib/data";
import { displayName, formatDate, percentage } from "@/lib/format";
import { requireStudent } from "@/lib/session";

export default async function StudentDashboard() {
  const student = await requireStudent();

  const [assignments, lecturer] = await Promise.all([
    listAssignmentsForStudent(student),
    student.lecturerId ? getUser(student.lecturerId) : Promise.resolve(null),
  ]);

  const handedIn = assignments.filter((a) => a.submission).length;
  const marked = assignments.filter(
    (a) => a.submission && a.submission.score !== null,
  );

  const average =
    marked.length > 0
      ? Math.round(
          marked.reduce(
            (sum, a) => sum + percentage(a.submission!.score!, a.maxScore),
            0,
          ) / marked.length,
        )
      : null;

  return (
    <div className="space-y-8">
      <header>
        <p className="section-title">{student.course}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-950">
          Hello, {student.name.split(" ")[0]}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-2">
          <StatTile
            label="Assignments"
            value={assignments.length}
            hint={`${assignments.length - handedIn} still to hand in`}
          />
          <StatTile label="Handed in" value={handedIn} />
          <StatTile
            label="Average"
            value={average === null ? "—" : `${average}%`}
            hint={`${marked.length} marked`}
          />
        </div>

        {lecturer && (
          <section className="card p-5">
            <h2 className="section-title">Your lecturer</h2>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={lecturer.name} accent={lecturer.accent} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-brand-900">
                  {displayName(lecturer)}
                </p>
                <p className="truncate text-xs text-brand-400">
                  {lecturer.department}
                </p>
                <a
                  href={`mailto:${lecturer.email}`}
                  className="truncate text-xs font-semibold text-brand-600 hover:underline"
                >
                  {lecturer.email}
                </a>
              </div>
            </div>
          </section>
        )}
      </div>

      <section>
        <h2 className="text-lg font-bold text-brand-900">Your coursework</h2>

        <div className="mt-3 space-y-3">
          {assignments.length === 0 ? (
            <EmptyState title="No assignments have been set yet">
              Anything your lecturer publishes will show up here.
            </EmptyState>
          ) : (
            assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/student/assignments/${assignment.id}`}
                className="card block p-5 transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-brand-900">
                      {assignment.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-brand-400">
                      {assignment.subject} · due{" "}
                      {formatDate(assignment.dueDate)} · {assignment.maxScore}{" "}
                      marks
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {assignment.submission?.score !== null &&
                    assignment.submission ? (
                      <ScorePill
                        score={assignment.submission.score!}
                        maxScore={assignment.maxScore}
                      />
                    ) : (
                      <DuePill dueDate={assignment.dueDate} />
                    )}
                    <StatusPill
                      status={submissionStatus(assignment.submission)}
                    />
                  </div>
                </div>

                {assignment.instructions && (
                  <p className="mt-3 line-clamp-2 text-sm text-brand-500">
                    {assignment.instructions}
                  </p>
                )}

                {assignment.submission?.feedback && (
                  <p className="mt-3 line-clamp-1 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-600 italic">
                    “{assignment.submission.feedback}”
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
