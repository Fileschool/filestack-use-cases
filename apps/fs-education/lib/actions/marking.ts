"use server";

import { refresh } from "next/cache";

import { getAssignment, getSubmission } from "@/lib/data";
import { db } from "@/lib/db";
import { requireLecturer } from "@/lib/session";
import { newId } from "@/lib/stored-file";
import type {
  ActionState,
  AnnotationTarget,
  AssignmentAnnotationInput,
  MarkingInput,
  OverlayUpload,
  Stroke,
} from "@/lib/types";

async function upsertAnnotation(
  targetType: AnnotationTarget,
  targetId: string,
  page: number,
  overlay: OverlayUpload,
  strokes: Stroke[],
): Promise<void> {
  const client = await db();

  // An empty page is a cleared page: drop the row instead of storing nothing.
  if (strokes.length === 0 && !overlay) {
    await client.execute({
      sql: "DELETE FROM annotations WHERE target_type = ? AND target_id = ? AND page = ?",
      args: [targetType, targetId, page],
    });
    return;
  }

  await client.execute({
    sql: `INSERT INTO annotations
            (id, target_type, target_id, page, overlay_url, overlay_handle, strokes_json, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT (target_type, target_id, page) DO UPDATE SET
            overlay_url = excluded.overlay_url,
            overlay_handle = excluded.overlay_handle,
            strokes_json = excluded.strokes_json,
            updated_at = datetime('now')`,
    args: [
      newId("ann"),
      targetType,
      targetId,
      page,
      overlay?.url ?? null,
      overlay?.handle ?? null,
      JSON.stringify(strokes),
    ],
  });
}

/**
 * Saves one marked page of a student's work together with the score and
 * comment from the panel beside the editor.
 */
export async function saveMarking(input: MarkingInput): Promise<ActionState> {
  const lecturer = await requireLecturer();

  const submission = await getSubmission(input.submissionId);
  if (!submission) return { error: "That submission no longer exists." };

  const assignment = await getAssignment(submission.assignmentId);
  if (!assignment || assignment.lecturerId !== lecturer.id) {
    return { error: "You cannot mark work for another lecturer's course." };
  }

  const raw = input.score.trim();
  let score: number | null = null;

  if (raw.length > 0) {
    score = Number(raw);
    if (!Number.isFinite(score) || score < 0) {
      return { error: "The score must be a number of 0 or more." };
    }
    if (score > assignment.maxScore) {
      return { error: `The score cannot be above ${assignment.maxScore}.` };
    }
  }

  const client = await db();
  await client.execute({
    sql: `UPDATE submissions
          SET score = ?, feedback = ?,
              graded_at = CASE WHEN ? IS NULL THEN NULL ELSE datetime('now') END,
              graded_by = CASE WHEN ? IS NULL THEN NULL ELSE ? END
          WHERE id = ?`,
    args: [
      score,
      input.feedback.trim(),
      score,
      score,
      lecturer.id,
      submission.id,
    ],
  });

  await upsertAnnotation(
    "submission",
    submission.id,
    input.page,
    input.overlay,
    input.strokes,
  );

  refresh();
  return { ok: true };
}

/** Marks up the assignment brief itself — a worked example for the class. */
export async function saveAssignmentAnnotation(
  input: AssignmentAnnotationInput,
): Promise<ActionState> {
  const lecturer = await requireLecturer();

  const assignment = await getAssignment(input.assignmentId);
  if (!assignment || assignment.lecturerId !== lecturer.id) {
    return { error: "That assignment no longer exists." };
  }

  await upsertAnnotation(
    "assignment",
    assignment.id,
    input.page,
    input.overlay,
    input.strokes,
  );

  refresh();
  return { ok: true };
}
