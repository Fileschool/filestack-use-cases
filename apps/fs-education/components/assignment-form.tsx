"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FilePicker } from "@/components/file-picker";
import { saveAssignment } from "@/lib/actions/assignments";
import type { ActionState, Assignment } from "@/lib/types";

export function AssignmentForm({
  assignment,
  defaultSubject,
}: {
  assignment?: Assignment;
  defaultSubject: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveAssignment,
    {},
  );

  const editing = Boolean(assignment);

  return (
    <form action={formAction} className="space-y-6">
      {assignment && <input type="hidden" name="id" value={assignment.id} />}

      <div className="card space-y-5 p-5 sm:p-6">
        <div>
          <label htmlFor="title" className="field-label">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={140}
            defaultValue={assignment?.title}
            placeholder="e.g. Problem set 6: Determinants"
            className="input"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label htmlFor="subject" className="field-label">
              Course
            </label>
            <input
              id="subject"
              name="subject"
              defaultValue={assignment?.subject ?? defaultSubject}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="field-label">
              Due date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              required
              defaultValue={assignment?.dueDate}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="maxScore" className="field-label">
              Total marks
            </label>
            <input
              id="maxScore"
              name="maxScore"
              type="number"
              min={1}
              max={1000}
              required
              defaultValue={assignment?.maxScore ?? 100}
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="instructions" className="field-label">
            The homework
          </label>
          <p className="field-hint">
            Type the brief here, attach it as a file below, or do both.
          </p>
          <textarea
            id="instructions"
            name="instructions"
            rows={8}
            defaultValue={assignment?.instructions}
            placeholder="What should students do, and what should they hand in?"
            className="input font-normal"
          />
        </div>

        <div>
          <span className="field-label">Attachment</span>
          <p className="field-hint">
            A brief, worksheet or scan. Images and PDFs can also be marked up in
            the editor.
          </p>
          <div className="mt-2">
            <FilePicker
              name="attachment"
              initialFile={assignment?.attachment ?? null}
              allowRemove
              ctaLabel="Upload the assignment file"
            />
          </div>
        </div>
      </div>

      {state.error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Publish assignment"}
        </button>
        <Link
          href={
            assignment ? `/lecturer/assignments/${assignment.id}` : "/lecturer"
          }
          className="btn-secondary"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
