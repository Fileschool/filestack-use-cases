"use client";

import { useActionState } from "react";

import { FilePicker } from "@/components/file-picker";
import { submitAssignment } from "@/lib/actions/submissions";
import type { ActionState, Submission } from "@/lib/types";

export function SubmissionForm({
  assignmentId,
  submission,
}: {
  assignmentId: string;
  submission: Submission | null;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    submitAssignment,
    {},
  );

  const resubmitting = Boolean(submission);
  const marked = submission?.score !== null && submission !== null;

  return (
    <form action={formAction} className="card space-y-4 p-5 sm:p-6">
      <input type="hidden" name="assignmentId" value={assignmentId} />

      <div>
        <h2 className="text-lg font-bold text-brand-900">
          {resubmitting ? "Hand in again" : "Hand in your work"}
        </h2>
        <p className="mt-1 text-sm text-brand-400">
          Photos, scans and PDFs work best — your lecturer marks directly on the
          page.
        </p>
      </div>

      {marked && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          This work has already been marked. Handing in a new file clears the
          score, comments and markings.
        </p>
      )}

      <FilePicker
        name="file"
        accept={["image/*", "application/pdf", ".doc", ".docx", ".txt"]}
        ctaLabel="Upload your assignment"
      />

      <div>
        <label htmlFor="note" className="field-label">
          Note for your lecturer{" "}
          <span className="font-normal text-brand-300">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          defaultValue={submission?.note}
          placeholder="Anything they should know before marking?"
          className="input"
        />
      </div>

      {state.error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Handed in. Your lecturer can see it now.
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending
          ? "Uploading…"
          : resubmitting
            ? "Replace my submission"
            : "Hand in"}
      </button>
    </form>
  );
}
