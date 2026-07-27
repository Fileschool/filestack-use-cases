import { describeDueDate, percentage, scoreTone } from "@/lib/format";

export function DuePill({ dueDate }: { dueDate: string }) {
  const { label, overdue, soon } = describeDueDate(dueDate);
  const tone = overdue
    ? "bg-rose-50 text-rose-700 ring-rose-200"
    : soon
      ? "bg-accent-100 text-accent-600 ring-accent-200"
      : "bg-brand-50 text-brand-600 ring-brand-200";

  return <span className={`pill ${tone}`}>{label}</span>;
}

export function ScorePill({
  score,
  maxScore,
}: {
  score: number;
  maxScore: number;
}) {
  return (
    <span className={`pill ${scoreTone(score, maxScore)}`}>
      {score}/{maxScore}
      <span className="font-medium opacity-70">
        ({percentage(score, maxScore)}%)
      </span>
    </span>
  );
}

type Status = "not-submitted" | "submitted" | "marked";

const STATUS_STYLES: Record<Status, { label: string; tone: string }> = {
  "not-submitted": {
    label: "Not handed in",
    tone: "bg-brand-50 text-brand-500 ring-brand-200",
  },
  submitted: {
    label: "Awaiting marking",
    tone: "bg-accent-100 text-accent-600 ring-accent-200",
  },
  marked: {
    label: "Marked",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

export function StatusPill({ status }: { status: Status }) {
  const { label, tone } = STATUS_STYLES[status];
  return <span className={`pill ${tone}`}>{label}</span>;
}

export function submissionStatus(submission: {
  score: number | null;
} | null): Status {
  if (!submission) return "not-submitted";
  return submission.score === null ? "submitted" : "marked";
}
