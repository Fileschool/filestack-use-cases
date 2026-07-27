import type { InStatement } from "@libsql/client";

export const SCHEMA_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id           TEXT PRIMARY KEY,
    role         TEXT NOT NULL CHECK (role IN ('lecturer', 'student')),
    name         TEXT NOT NULL,
    title        TEXT,
    email        TEXT NOT NULL UNIQUE,
    department   TEXT,
    course       TEXT,
    lecturer_id  TEXT REFERENCES users(id) ON DELETE SET NULL,
    accent       TEXT NOT NULL DEFAULT 'indigo',
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS assignments (
    id                  TEXT PRIMARY KEY,
    lecturer_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               TEXT NOT NULL,
    subject             TEXT NOT NULL DEFAULT '',
    instructions        TEXT NOT NULL DEFAULT '',
    due_date            TEXT NOT NULL,
    max_score           INTEGER NOT NULL DEFAULT 100,
    attachment_url      TEXT,
    attachment_handle   TEXT,
    attachment_name     TEXT,
    attachment_mimetype TEXT,
    attachment_size     INTEGER,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS submissions (
    id            TEXT PRIMARY KEY,
    assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note          TEXT NOT NULL DEFAULT '',
    file_url      TEXT,
    file_handle   TEXT,
    file_name     TEXT,
    file_mimetype TEXT,
    file_size     INTEGER,
    submitted_at  TEXT NOT NULL DEFAULT (datetime('now')),
    score         REAL,
    feedback      TEXT NOT NULL DEFAULT '',
    graded_at     TEXT,
    graded_by     TEXT REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE (assignment_id, student_id)
  )`,

  // The lecturer's drawing is kept as a transparent PNG overlay in Filestack
  // plus the raw strokes, so a marked page can be re-opened and edited.
  `CREATE TABLE IF NOT EXISTS annotations (
    id             TEXT PRIMARY KEY,
    target_type    TEXT NOT NULL CHECK (target_type IN ('submission', 'assignment')),
    target_id      TEXT NOT NULL,
    page           INTEGER NOT NULL DEFAULT 1,
    overlay_url    TEXT,
    overlay_handle TEXT,
    strokes_json   TEXT NOT NULL DEFAULT '[]',
    updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (target_type, target_id, page)
  )`,

  `CREATE INDEX IF NOT EXISTS idx_assignments_lecturer ON assignments(lecturer_id)`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id)`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id)`,
  `CREATE INDEX IF NOT EXISTS idx_users_lecturer ON users(lecturer_id)`,
];

/** ISO date `days` from today, used to make seeded due dates look current. */
function dueIn(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const LECTURERS = [
  {
    id: "lec_okafor",
    name: "Amara Okafor",
    title: "Dr.",
    email: "a.okafor@fsedu.example",
    department: "Computer Science",
    course: "CS 204 - Web Systems",
    accent: "indigo",
  },
  {
    id: "lec_whitfield",
    name: "Daniel Whitfield",
    title: "Prof.",
    email: "d.whitfield@fsedu.example",
    department: "Mathematics",
    course: "MTH 118 - Linear Algebra",
    accent: "emerald",
  },
];

const STUDENTS = [
  {
    id: "stu_bello",
    name: "Zainab Bello",
    email: "z.bello@fsedu.example",
    course: "CS 204 - Web Systems",
    lecturerId: "lec_okafor",
    accent: "rose",
  },
  {
    id: "stu_mensah",
    name: "Kwabena Mensah",
    email: "k.mensah@fsedu.example",
    course: "CS 204 - Web Systems",
    lecturerId: "lec_okafor",
    accent: "amber",
  },
  {
    id: "stu_ferreira",
    name: "Luca Ferreira",
    email: "l.ferreira@fsedu.example",
    course: "CS 204 - Web Systems",
    lecturerId: "lec_okafor",
    accent: "sky",
  },
  {
    id: "stu_haddad",
    name: "Nour Haddad",
    email: "n.haddad@fsedu.example",
    course: "CS 204 - Web Systems",
    lecturerId: "lec_okafor",
    accent: "violet",
  },
  {
    id: "stu_novak",
    name: "Petra Novak",
    email: "p.novak@fsedu.example",
    course: "MTH 118 - Linear Algebra",
    lecturerId: "lec_whitfield",
    accent: "teal",
  },
  {
    id: "stu_adeyemi",
    name: "Tunde Adeyemi",
    email: "t.adeyemi@fsedu.example",
    course: "MTH 118 - Linear Algebra",
    lecturerId: "lec_whitfield",
    accent: "orange",
  },
];

const ASSIGNMENTS = [
  {
    id: "asg_render_pipeline",
    lecturerId: "lec_okafor",
    title: "Server rendering write-up",
    subject: "CS 204 - Web Systems",
    instructions:
      "In no more than two pages, trace a single request through a server-rendered application. Cover the render, the streamed response, and where caching can safely sit. Hand-drawn diagrams are welcome — photograph them and upload the image.",
    dueDate: dueIn(6),
    maxScore: 40,
  },
  {
    id: "asg_api_design",
    lecturerId: "lec_okafor",
    title: "Lab 3: File upload API design",
    subject: "CS 204 - Web Systems",
    instructions:
      "Design the endpoints for an upload-and-review feature. Submit a PDF containing your endpoint table, the validation rules you would enforce, and one paragraph on how you would store the files.",
    dueDate: dueIn(13),
    maxScore: 60,
  },
  {
    id: "asg_eigenvectors",
    lecturerId: "lec_whitfield",
    title: "Problem set 5: Eigenvectors",
    subject: "MTH 118 - Linear Algebra",
    instructions:
      "Questions 1-8 from the handout. Show every step of your working; answers alone score nothing. Scan or photograph your written solutions and upload them as a single file.",
    dueDate: dueIn(4),
    maxScore: 50,
  },
];

export const SEED_STATEMENTS: InStatement[] = [
  ...LECTURERS.map((lecturer) => ({
    sql: `INSERT INTO users (id, role, name, title, email, department, course, lecturer_id, accent)
          VALUES (?, 'lecturer', ?, ?, ?, ?, ?, NULL, ?)`,
    args: [
      lecturer.id,
      lecturer.name,
      lecturer.title,
      lecturer.email,
      lecturer.department,
      lecturer.course,
      lecturer.accent,
    ],
  })),

  ...STUDENTS.map((student) => ({
    sql: `INSERT INTO users (id, role, name, title, email, department, course, lecturer_id, accent)
          VALUES (?, 'student', ?, NULL, ?, NULL, ?, ?, ?)`,
    args: [
      student.id,
      student.name,
      student.email,
      student.course,
      student.lecturerId,
      student.accent,
    ],
  })),

  ...ASSIGNMENTS.map((assignment) => ({
    sql: `INSERT INTO assignments (id, lecturer_id, title, subject, instructions, due_date, max_score)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      assignment.id,
      assignment.lecturerId,
      assignment.title,
      assignment.subject,
      assignment.instructions,
      assignment.dueDate,
      assignment.maxScore,
    ],
  })),
];
