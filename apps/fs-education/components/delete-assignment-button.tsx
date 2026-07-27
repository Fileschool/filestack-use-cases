"use client";

import { deleteAssignment } from "@/lib/actions/assignments";

export function DeleteAssignmentButton({
  assignmentId,
  title,
}: {
  assignmentId: string;
  title: string;
}) {
  return (
    <form
      action={deleteAssignment}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete “${title}”? Submissions and marking for it are deleted too.`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={assignmentId} />
      <button type="submit" className="btn-danger">
        Delete
      </button>
    </form>
  );
}
