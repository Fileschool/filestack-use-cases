export type Role = "lecturer" | "student";

export type User = {
  id: string;
  role: Role;
  name: string;
  title: string | null;
  email: string;
  department: string | null;
  course: string | null;
  /** Students belong to one lecturer. Null for lecturers. */
  lecturerId: string | null;
  accent: string;
};

/** A file that lives in Filestack. */
export type StoredFile = {
  url: string;
  handle: string;
  name: string;
  mimetype: string;
  size: number;
};

export type Assignment = {
  id: string;
  lecturerId: string;
  title: string;
  subject: string;
  /** Typed-in homework text. Empty when the brief is only a file. */
  instructions: string;
  dueDate: string;
  maxScore: number;
  attachment: StoredFile | null;
  createdAt: string;
  updatedAt: string;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  note: string;
  file: StoredFile | null;
  submittedAt: string;
  score: number | null;
  feedback: string;
  gradedAt: string | null;
};

export type AnnotationTarget = "submission" | "assignment";

/** One drawn mark on the annotation layer. */
export type Stroke = {
  tool: "pen" | "highlighter" | "rect" | "arrow" | "text";
  color: string;
  width: number;
  /** Normalised 0..1 coordinates so the overlay scales with the page. */
  points: { x: number; y: number }[];
  text?: string;
};

export type Annotation = {
  id: string;
  targetType: AnnotationTarget;
  targetId: string;
  page: number;
  overlayUrl: string | null;
  overlayHandle: string | null;
  strokes: Stroke[];
  updatedAt: string;
};

/** A submission joined with the student who made it. */
export type SubmissionWithStudent = Submission & { student: User };

/** An assignment joined with the current student's submission, if any. */
export type AssignmentForStudent = Assignment & {
  submission: Submission | null;
};

/** Shape returned by form actions used with `useActionState`. */
export type ActionState = { error?: string; ok?: boolean };

/** The transparent PNG the annotation editor renders and uploads. */
export type OverlayUpload = { url: string; handle: string } | null;

export type MarkingInput = {
  submissionId: string;
  page: number;
  overlay: OverlayUpload;
  strokes: Stroke[];
  /** Raw input value; empty string clears the mark. */
  score: string;
  feedback: string;
};

export type AssignmentAnnotationInput = {
  assignmentId: string;
  page: number;
  overlay: OverlayUpload;
  strokes: Stroke[];
};

export type AssignmentWithStats = Assignment & {
  submissionCount: number;
  gradedCount: number;
  classSize: number;
};
