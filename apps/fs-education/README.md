# Fairmount College — Coursework Portal

A two-sided coursework demo built on **Next.js 16** that shows off the
[Filestack](https://www.filestack.com/) upload and file-processing APIs. A
lecturer sets assignments and marks work by **drawing directly on the page**; a
student hands in files and reads back their score and marked-up pages.

Logins are **emulated** — the sign-in screen lists a few people and picking one
starts a session. There are no passwords; this is a demo of the file workflow,
not of authentication.

## Features

**Lecturer**

- Add, edit and delete assignments — type the brief in, upload it as a file, or
  both.
- See each assignment's detail, who has handed in, and who hasn't.
- Open a student's image/PDF submission in the **annotation editor**: pen,
  highlighter, box, arrow and text tools, then enter a score and comments beside
  the page.
- Mark up the assignment brief itself (a worked example for the class).

**Student**

- See their lecturer and every assignment on their course.
- Upload their work with the Filestack picker (photos, scans, PDFs, documents).
- Read back their score, written comments, and the lecturer's marked pages.

## How Filestack is used

- **Uploads** — the [File Picker](https://www.filestack.com/docs/uploads/pickers/web/)
  handles assignment files and student submissions; the annotation overlay
  (a transparent PNG the lecturer draws) is pushed up with `client.upload`.
- **Processing** — pages are rendered from the original file by the
  [Processing API](https://www.filestack.com/docs/api/processing/): PDFs via the
  `output` task (`format:png,page:N`), thumbnails via `resize`, and PDF page
  counts via `pdfinfo`. The student's file is never altered — the drawing is a
  separate overlay stacked on top of the rendered page.

See [`lib/filestack.ts`](lib/filestack.ts) for the URL helpers.

## Getting started

```bash
cp .env.example .env.local   # then paste your Filestack API key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and pick an account.

### Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FILESTACK_API_KEY` | **Required.** Enables uploads and CDN processing. |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Used when hosted. |
| `LOCAL_DATABASE_URL` | Optional override for the local DB file. |

Without the Filestack key the app still runs — the pickers show a hint and the
editor saves scores and comments without the drawing overlay.

## Data

The app uses [libSQL](https://github.com/tursodatabase/libsql). Locally it falls
back to a file-backed SQLite database at `.data/fs-education.db` (created and
seeded on first run — nothing to install). When `TURSO_DATABASE_URL` is set it
talks to [Turso](https://turso.tech/) over the same client, so the query code
never branches. Schema and seed data live in [`lib/schema.ts`](lib/schema.ts).

## Project layout

```
app/
  page.tsx                       Emulated sign-in
  lecturer/                      Lecturer side (guarded)
    assignments/[id]/            Detail, edit, annotate brief
    submissions/[id]/            Mark a submission
  student/                       Student side (guarded)
    assignments/[id]/            Brief, hand in, result
components/                      UI + the annotation editor
lib/
  actions/                       Server Actions (auth, assignments, submissions, marking)
  data.ts  db.ts  schema.ts      Data access
  filestack.ts  filestack-client.ts   Filestack helpers
```
