import "server-only";

import type { Row } from "@libsql/client";

import { db } from "./db";
import type {
  Annotation,
  AnnotationTarget,
  Assignment,
  AssignmentForStudent,
  AssignmentWithStats,
  Role,
  StoredFile,
  Stroke,
  Submission,
  SubmissionWithStudent,
  User,
} from "./types";

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : Number(value ?? fallback);
}

function nullableNum(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function toUser(row: Row): User {
  return {
    id: text(row.id),
    role: text(row.role) as Role,
    name: text(row.name),
    title: nullableText(row.title),
    email: text(row.email),
    department: nullableText(row.department),
    course: nullableText(row.course),
    lecturerId: nullableText(row.lecturer_id),
    accent: text(row.accent) || "indigo",
  };
}

/** Builds a StoredFile from a `prefix_url` / `prefix_handle` / ... row shape. */
function toStoredFile(row: Row, prefix: string): StoredFile | null {
  const url = nullableText(row[`${prefix}_url`]);
  if (!url) return null;

  return {
    url,
    handle: text(row[`${prefix}_handle`]),
    name: text(row[`${prefix}_name`]) || "attachment",
    mimetype: text(row[`${prefix}_mimetype`]),
    size: num(row[`${prefix}_size`]),
  };
}

function toAssignment(row: Row): Assignment {
  return {
    id: text(row.id),
    lecturerId: text(row.lecturer_id),
    title: text(row.title),
    subject: text(row.subject),
    instructions: text(row.instructions),
    dueDate: text(row.due_date),
    maxScore: num(row.max_score, 100),
    attachment: toStoredFile(row, "attachment"),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
  };
}

function toSubmission(row: Row): Submission {
  return {
    id: text(row.id),
    assignmentId: text(row.assignment_id),
    studentId: text(row.student_id),
    note: text(row.note),
    file: toStoredFile(row, "file"),
    submittedAt: text(row.submitted_at),
    score: nullableNum(row.score),
    feedback: text(row.feedback),
    gradedAt: nullableText(row.graded_at),
  };
}

function toAnnotation(row: Row): Annotation {
  let strokes: Stroke[] = [];

  try {
    const parsed = JSON.parse(text(row.strokes_json) || "[]");
    if (Array.isArray(parsed)) strokes = parsed as Stroke[];
  } catch {
    strokes = [];
  }

  return {
    id: text(row.id),
    targetType: text(row.target_type) as AnnotationTarget,
    targetId: text(row.target_id),
    page: num(row.page, 1),
    overlayUrl: nullableText(row.overlay_url),
    overlayHandle: nullableText(row.overlay_handle),
    strokes,
    updatedAt: text(row.updated_at),
  };
}

// --- users ----------------------------------------------------------------

export async function listUsersByRole(role: Role): Promise<User[]> {
  const client = await db();
  const { rows } = await client.execute({
    sql: "SELECT * FROM users WHERE role = ? ORDER BY name",
    args: [role],
  });
  return rows.map(toUser);
}

export async function getUser(id: string): Promise<User | null> {
  const client = await db();
  const { rows } = await client.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });
  return rows[0] ? toUser(rows[0]) : null;
}

export async function listStudentsOf(lecturerId: string): Promise<User[]> {
  const client = await db();
  const { rows } = await client.execute({
    sql: "SELECT * FROM users WHERE role = 'student' AND lecturer_id = ? ORDER BY name",
    args: [lecturerId],
  });
  return rows.map(toUser);
}

// --- assignments ----------------------------------------------------------

export async function listAssignmentsForLecturer(
  lecturerId: string,
): Promise<AssignmentWithStats[]> {
  const client = await db();
  const { rows } = await client.execute({
    sql: `SELECT a.*,
            (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) AS submission_count,
            (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id AND s.score IS NOT NULL) AS graded_count,
            (SELECT COUNT(*) FROM users u WHERE u.role = 'student' AND u.lecturer_id = a.lecturer_id) AS class_size
          FROM assignments a
          WHERE a.lecturer_id = ?
          ORDER BY a.due_date ASC, a.created_at DESC`,
    args: [lecturerId],
  });

  return rows.map((row) => ({
    ...toAssignment(row),
    submissionCount: num(row.submission_count),
    gradedCount: num(row.graded_count),
    classSize: num(row.class_size),
  }));
}

export async function getAssignment(id: string): Promise<Assignment | null> {
  const client = await db();
  const { rows } = await client.execute({
    sql: "SELECT * FROM assignments WHERE id = ?",
    args: [id],
  });
  return rows[0] ? toAssignment(rows[0]) : null;
}

export async function listAssignmentsForStudent(
  student: User,
): Promise<AssignmentForStudent[]> {
  if (!student.lecturerId) return [];

  const client = await db();
  const { rows } = await client.execute({
    sql: `SELECT a.*,
            s.id AS s_id, s.assignment_id AS s_assignment_id, s.student_id AS s_student_id,
            s.note AS s_note, s.file_url AS s_file_url, s.file_handle AS s_file_handle,
            s.file_name AS s_file_name, s.file_mimetype AS s_file_mimetype,
            s.file_size AS s_file_size, s.submitted_at AS s_submitted_at,
            s.score AS s_score, s.feedback AS s_feedback, s.graded_at AS s_graded_at
          FROM assignments a
          LEFT JOIN submissions s
            ON s.assignment_id = a.id AND s.student_id = ?
          WHERE a.lecturer_id = ?
          ORDER BY a.due_date ASC, a.created_at DESC`,
    args: [student.id, student.lecturerId],
  });

  return rows.map((row) => ({
    ...toAssignment(row),
    submission: row.s_id
      ? toSubmission({
          id: row.s_id,
          assignment_id: row.s_assignment_id,
          student_id: row.s_student_id,
          note: row.s_note,
          file_url: row.s_file_url,
          file_handle: row.s_file_handle,
          file_name: row.s_file_name,
          file_mimetype: row.s_file_mimetype,
          file_size: row.s_file_size,
          submitted_at: row.s_submitted_at,
          score: row.s_score,
          feedback: row.s_feedback,
          graded_at: row.s_graded_at,
        } as unknown as Row)
      : null,
  }));
}

// --- submissions ----------------------------------------------------------

export async function listSubmissionsForAssignment(
  assignmentId: string,
): Promise<SubmissionWithStudent[]> {
  const client = await db();
  const { rows } = await client.execute({
    sql: `SELECT s.*, u.id AS u_id, u.role AS u_role, u.name AS u_name, u.title AS u_title,
            u.email AS u_email, u.department AS u_department, u.course AS u_course,
            u.lecturer_id AS u_lecturer_id, u.accent AS u_accent
          FROM submissions s
          JOIN users u ON u.id = s.student_id
          WHERE s.assignment_id = ?
          ORDER BY s.submitted_at DESC`,
    args: [assignmentId],
  });

  return rows.map((row) => ({
    ...toSubmission(row),
    student: toUser({
      id: row.u_id,
      role: row.u_role,
      name: row.u_name,
      title: row.u_title,
      email: row.u_email,
      department: row.u_department,
      course: row.u_course,
      lecturer_id: row.u_lecturer_id,
      accent: row.u_accent,
    } as unknown as Row),
  }));
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const client = await db();
  const { rows } = await client.execute({
    sql: "SELECT * FROM submissions WHERE id = ?",
    args: [id],
  });
  return rows[0] ? toSubmission(rows[0]) : null;
}

export async function getSubmissionForStudent(
  assignmentId: string,
  studentId: string,
): Promise<Submission | null> {
  const client = await db();
  const { rows } = await client.execute({
    sql: "SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?",
    args: [assignmentId, studentId],
  });
  return rows[0] ? toSubmission(rows[0]) : null;
}

/** Every score a student has been given, newest first. */
export async function listGradesForStudent(
  studentId: string,
): Promise<{ submission: Submission; assignment: Assignment }[]> {
  const client = await db();
  const { rows } = await client.execute({
    sql: `SELECT s.*, a.title AS a_title, a.subject AS a_subject, a.max_score AS a_max_score,
            a.due_date AS a_due_date, a.lecturer_id AS a_lecturer_id, a.id AS a_id
          FROM submissions s
          JOIN assignments a ON a.id = s.assignment_id
          WHERE s.student_id = ? AND s.score IS NOT NULL
          ORDER BY s.graded_at DESC`,
    args: [studentId],
  });

  return rows.map((row) => ({
    submission: toSubmission(row),
    assignment: {
      id: text(row.a_id),
      lecturerId: text(row.a_lecturer_id),
      title: text(row.a_title),
      subject: text(row.a_subject),
      instructions: "",
      dueDate: text(row.a_due_date),
      maxScore: num(row.a_max_score, 100),
      attachment: null,
      createdAt: "",
      updatedAt: "",
    },
  }));
}

// --- annotations ----------------------------------------------------------

export async function listAnnotations(
  targetType: AnnotationTarget,
  targetId: string,
): Promise<Annotation[]> {
  const client = await db();
  const { rows } = await client.execute({
    sql: `SELECT * FROM annotations
          WHERE target_type = ? AND target_id = ?
          ORDER BY page ASC`,
    args: [targetType, targetId],
  });
  return rows.map(toAnnotation);
}
