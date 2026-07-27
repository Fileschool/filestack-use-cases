import Link from "next/link";

import { Avatar } from "@/components/avatar";
import { EmptyState } from "@/components/empty-state";
import { DuePill } from "@/components/pills";
import { StatTile } from "@/components/stat-tile";
import { listAssignmentsForLecturer, listStudentsOf } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requireLecturer } from "@/lib/session";

export default async function LecturerDashboard() {
  const lecturer = await requireLecturer();
  const [assignments, students] = await Promise.all([
    listAssignmentsForLecturer(lecturer.id),
    listStudentsOf(lecturer.id),
  ]);

  const handedIn = assignments.reduce((sum, a) => sum + a.submissionCount, 0);
  const marked = assignments.reduce((sum, a) => sum + a.gradedCount, 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-title">{lecturer.department}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-950">
            {lecturer.course}
          </h1>
          <p className="mt-1 text-sm text-brand-400">
            {students.length} students on the register
          </p>
        </div>
        <Link href="/lecturer/assignments/new" className="btn-primary">
          Add assignment
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Assignments" value={assignments.length} />
        <StatTile label="Handed in" value={handedIn} />
        <StatTile
          label="Awaiting marking"
          value={handedIn - marked}
          hint={handedIn - marked > 0 ? "Ready to review" : "All caught up"}
        />
        <StatTile label="Students" value={students.length} />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-900">Assignments</h2>
          <span className="text-xs text-brand-400">
            Sorted by due date
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {assignments.length === 0 ? (
            <EmptyState title="No assignments yet">
              <Link
                href="/lecturer/assignments/new"
                className="font-semibold text-brand-700 underline"
              >
                Set your first assignment
              </Link>{" "}
              — type the brief or upload it as a file.
            </EmptyState>
          ) : (
            assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/lecturer/assignments/${assignment.id}`}
                className="card block p-5 transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-brand-900">
                      {assignment.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-brand-400">
                      {assignment.subject} · due {formatDate(assignment.dueDate)}{" "}
                      · {assignment.maxScore} marks
                    </p>
                  </div>
                  <DuePill dueDate={assignment.dueDate} />
                </div>

                {assignment.instructions && (
                  <p className="mt-3 line-clamp-2 text-sm text-brand-500">
                    {assignment.instructions}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-semibold text-brand-500">
                  <span>
                    {assignment.submissionCount} of {assignment.classSize} handed
                    in
                  </span>
                  <span>{assignment.gradedCount} marked</span>
                  {assignment.attachment && (
                    <span className="text-brand-400">
                      Attachment: {assignment.attachment.name}
                    </span>
                  )}
                </div>

                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{
                      width: `${
                        assignment.classSize
                          ? Math.min(
                              100,
                              (assignment.submissionCount /
                                assignment.classSize) *
                                100,
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-brand-900">Your class</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="card flex items-center gap-3 p-3.5"
            >
              <Avatar name={student.name} accent={student.accent} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-900">
                  {student.name}
                </p>
                <p className="truncate text-xs text-brand-400">
                  {student.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
