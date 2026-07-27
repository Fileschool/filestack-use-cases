"use server";

import { redirect } from "next/navigation";

import { getAssignment } from "@/lib/data";
import { db } from "@/lib/db";
import { requireLecturer } from "@/lib/session";
import { newId, parseStoredFile } from "@/lib/stored-file";
import type { ActionState } from "@/lib/types";

/**
 * Creates an assignment, or updates it when the form carries an `id`.
 * A brief can be typed in, attached as a file, or both — but not neither.
 */
export async function saveAssignment(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const lecturer = await requireLecturer();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const maxScore = Number(formData.get("maxScore") ?? 100);
  const attachment = parseStoredFile(formData.get("attachment"));
  const removeAttachment = formData.get("removeAttachment") === "on";

  if (!title) return { error: "Give the assignment a title." };
  if (!dueDate) return { error: "Pick a due date." };
  if (!Number.isFinite(maxScore) || maxScore <= 0) {
    return { error: "Total marks must be a positive number." };
  }

  const client = await db();

  if (id) {
    const existing = await getAssignment(id);
    if (!existing || existing.lecturerId !== lecturer.id) {
      return { error: "That assignment no longer exists." };
    }

    // Keep the current attachment unless a new one was picked or it was removed.
    const nextFile = attachment ?? (removeAttachment ? null : existing.attachment);

    if (!instructions && !nextFile) {
      return { error: "Type the homework or attach a file (or both)." };
    }

    await client.execute({
      sql: `UPDATE assignments
            SET title = ?, subject = ?, instructions = ?, due_date = ?, max_score = ?,
                attachment_url = ?, attachment_handle = ?, attachment_name = ?,
                attachment_mimetype = ?, attachment_size = ?,
                updated_at = datetime('now')
            WHERE id = ? AND lecturer_id = ?`,
      args: [
        title,
        subject,
        instructions,
        dueDate,
        maxScore,
        nextFile?.url ?? null,
        nextFile?.handle ?? null,
        nextFile?.name ?? null,
        nextFile?.mimetype ?? null,
        nextFile?.size ?? null,
        id,
        lecturer.id,
      ],
    });

    if (removeAttachment && !attachment) {
      await client.execute({
        sql: "DELETE FROM annotations WHERE target_type = 'assignment' AND target_id = ?",
        args: [id],
      });
    }

    redirect(`/lecturer/assignments/${id}`);
  }

  if (!instructions && !attachment) {
    return { error: "Type the homework or attach a file (or both)." };
  }

  const assignmentId = newId("asg");

  await client.execute({
    sql: `INSERT INTO assignments
            (id, lecturer_id, title, subject, instructions, due_date, max_score,
             attachment_url, attachment_handle, attachment_name, attachment_mimetype, attachment_size)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      assignmentId,
      lecturer.id,
      title,
      subject,
      instructions,
      dueDate,
      maxScore,
      attachment?.url ?? null,
      attachment?.handle ?? null,
      attachment?.name ?? null,
      attachment?.mimetype ?? null,
      attachment?.size ?? null,
    ],
  });

  redirect(`/lecturer/assignments/${assignmentId}`);
}

export async function deleteAssignment(formData: FormData): Promise<void> {
  const lecturer = await requireLecturer();
  const id = String(formData.get("id") ?? "");

  const client = await db();
  await client.execute({
    sql: "DELETE FROM assignments WHERE id = ? AND lecturer_id = ?",
    args: [id, lecturer.id],
  });
  await client.execute({
    sql: "DELETE FROM annotations WHERE target_type = 'assignment' AND target_id = ?",
    args: [id],
  });

  redirect("/lecturer");
}
