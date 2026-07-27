import { redirect } from "next/navigation";

import {
  FilestackGlyph,
  FilestackWordmark,
} from "@/components/filestack-logo";
import { LandingHeader } from "@/components/landing-header";
import { LoginCta } from "@/components/login-cta";
import {
  DashboardMockup,
  MarkingEditorMockup,
  StudentResultMockup,
} from "@/components/mockups";
import { listUsersByRole } from "@/lib/data";
import { getCurrentUser, homeFor } from "@/lib/session";

const STEPS = [
  {
    n: "1",
    title: "Lecturer sets the work",
    body: "Type the brief or upload a worksheet, PDF or image. Set the due date and total marks, then it appears for the whole class.",
  },
  {
    n: "2",
    title: "Students hand in",
    body: "Photos, scans and PDFs go straight to the cloud from the upload picker. Re-submit any time before it's marked.",
  },
  {
    n: "3",
    title: "Marked on the page",
    body: "The lecturer draws directly on each page — pen, highlighter, notes — then enters a score and comments the student reads back.",
  },
];

const FEATURES = [
  {
    title: "Draw-on-the-page marking",
    body: "Open any image or PDF submission in the editor and annotate it with pen, highlighter, boxes, arrows and text. Multi-page documents included.",
  },
  {
    title: "Scores & written feedback",
    body: "Enter a mark out of the total and leave comments beside the work. Students see their result, feedback and marked pages together.",
  },
  {
    title: "Submissions at a glance",
    body: "Every assignment shows who's handed in, who hasn't and what's left to mark — no spreadsheet required.",
  },
  {
    title: "Nothing to install",
    body: "Two emulated sides — lecturer and student — with demo accounts ready to go. Log in from the top right and start clicking.",
  },
];

export default async function LandingPage() {
  const current = await getCurrentUser();
  if (current) redirect(homeFor(current));

  const [lecturers, students] = await Promise.all([
    listUsersByRole("lecturer"),
    listUsersByRole("student"),
  ]);

  const teacher = lecturers[0];
  const student = students[0];

  return (
    <>
      {teacher && student && (
        <LandingHeader
          teacher={{ id: teacher.id, name: teacher.name, email: teacher.email }}
          student={{ id: student.id, name: student.name, email: student.email }}
        />
      )}

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-24">
          <p className="section-title">Coursework portal</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight text-brand-950 sm:text-6xl">
            Set the work. Hand it in.{" "}
            <span className="text-accent-500">Mark it on the page.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-500">
            A coursework tool for lecturers and students. Assignments go out as
            typed briefs or files, students upload their work, and marking
            happens right on top of it — draw on the page, leave a comment,
            enter a score.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LoginCta role="teacher" className="btn-primary px-5 py-3 text-base">
              I&apos;m a lecturer
            </LoginCta>
            <LoginCta
              role="student"
              className="btn-secondary px-5 py-3 text-base"
            >
              I&apos;m a student
            </LoginCta>
          </div>
          <p className="mt-3 text-xs text-brand-400">
            No sign-up — demo accounts are pre-filled and ready.
          </p>
        </section>

        {/* Hero banner */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-x-6 -top-6 bottom-8 -z-10 rounded-[2rem] bg-gradient-to-b from-accent-100/70 to-transparent"
            />
            <MarkingEditorMockup />
          </div>
        </section>

        {/* For lecturers */}
        <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <DashboardMockup />
            <div className="lg:pl-4">
              <p className="section-title">For lecturers</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-950">
                Set the work and see where the class is
              </h2>
              <p className="mt-3 text-base leading-7 text-brand-500">
                Add, edit or delete assignments in seconds. Every one shows how
                many students have handed in, how many are marked, and who&apos;s
                still outstanding — no chasing spreadsheets.
              </p>
              <div className="mt-5">
                <LoginCta role="teacher" className="btn-primary">
                  Open the lecturer view
                </LoginCta>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-brand-950">
            How it works
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="card p-6">
                <span className="grid size-9 place-items-center rounded-lg bg-accent-100 text-sm font-black text-accent-600">
                  {step.n}
                </span>
                <h3 className="mt-4 text-base font-bold text-brand-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-brand-500">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* For students */}
        <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="order-2 lg:order-1 lg:pr-4">
              <p className="section-title">For students</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-950">
                Hand in, then read the marked page back
              </h2>
              <p className="mt-3 text-base leading-7 text-brand-500">
                Upload a photo, scan or PDF straight from your phone or laptop.
                When it&apos;s marked, your score, written comments and the
                lecturer&apos;s annotations come back together on the page.
              </p>
              <div className="mt-5">
                <LoginCta role="student" className="btn-primary">
                  Open the student view
                </LoginCta>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <StudentResultMockup />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-6">
                <h3 className="text-base font-bold text-brand-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-brand-500">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Filestack strip */}
        <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
          <div className="card flex flex-col items-start gap-4 bg-brand-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <FilestackGlyph className="h-5" />
                <span className="text-lg font-bold">
                  file<span className="text-accent-500">stack</span>
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-brand-200">
                Every file — briefs, submissions and the lecturer&apos;s
                annotation overlays — is stored on the Filestack CDN. PDF pages
                are rendered to images, thumbnails are resized and page counts
                read, all through the Filestack Processing API.
              </p>
            </div>
            <LoginCta
              role="student"
              className="btn-accent shrink-0 px-5 py-3 text-base"
            >
              Try the demo
            </LoginCta>
          </div>
        </section>

        {/* Footer */}
        <footer className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-4 py-10 text-center sm:px-6">
          <p className="flex items-center gap-1.5 text-xs text-brand-400">
            Uploads &amp; file processing by
            <FilestackGlyph className="h-4" />
            <FilestackWordmark className="text-sm" />
          </p>
          <p className="text-xs text-brand-300">
            Fairmount College · a coursework demo
          </p>
        </footer>
      </main>
    </>
  );
}
