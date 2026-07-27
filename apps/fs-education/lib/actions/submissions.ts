"use server";

import { refresh } from "next/cache";

import { getAssignment, getSubmissionForStudent } from "@/lib/data";
import { db } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { newId, parseStoredFile } from "@/lib/stored-file";
import type { ActionState } from "@/lib/types";

/**
 * Hands in (or replaces) a student's work for one assignment. Replacing work
 * that has already been marked clears the mark and the lecturer's annotations,
 * because they no longer describe the file on record.
 */
export async function submitAssignment(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const student = await requireStudent();

  const assignmentId = String(formData.get("assignmentId") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const file = parseStoredFile(formData.get("file"));

  const assignment = await getAssignment(assignmentId);
  if (!assignment || assignment.lecturerId !== student.lecturerId) {
    return { error: "That assignment is not on your course." };
  }
  if (!file) {
    return { error: "Choose a file to upload before handing in." };
  }

  const client = await db();
  const existing = await getSubmissionForStudent(assignmentId, student.id);

  if (existing) {
    await client.execute({
      sql: `UPDATE submissions
            SET note = ?, file_url = ?, file_handle = ?, file_name = ?, file_mimetype = ?,
                file_size = ?, submitted_at = datetime('now'),
                score = NULL, feedback = '', graded_at = NULL, graded_by = NULL
            WHERE id = ?`,
      args: [
        note,
        file.url,
        file.handle,
        file.name,
        file.mimetype,
        file.size,
        existing.id,
      ],
    });
    await client.execute({
      sql: "DELETE FROM annotations WHERE target_type = 'submission' AND target_id = ?",
      args: [existing.id],
    });
  } else {
    await client.execute({
      sql: `INSERT INTO submissions
              (id, assignment_id, student_id, note, file_url, file_handle, file_name, file_mimetype, file_size)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newId("sub"),
        assignmentId,
        student.id,
        note,
        file.url,
        file.handle,
        file.name,
        file.mimetype,
        file.size,
      ],
    });
  }

  refresh();
  return { ok: true };
}
