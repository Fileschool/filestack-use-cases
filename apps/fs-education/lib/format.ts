const DAY_MS = 24 * 60 * 60 * 1000;

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  // SQLite's datetime('now') returns "YYYY-MM-DD HH:MM:SS" in UTC.
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function startOfDayUTC(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** "Due today", "Due in 3 days", "3 days overdue". */
export function describeDueDate(dueDate: string): {
  label: string;
  overdue: boolean;
  soon: boolean;
} {
  const due = new Date(`${dueDate}T00:00:00Z`);
  if (Number.isNaN(due.getTime())) {
    return { label: dueDate, overdue: false, soon: false };
  }

  const days = Math.round(
    (startOfDayUTC(due) - startOfDayUTC(new Date())) / DAY_MS,
  );

  if (days === 0) return { label: "Due today", overdue: false, soon: true };
  if (days === 1) return { label: "Due tomorrow", overdue: false, soon: true };
  if (days < 0) {
    const late = Math.abs(days);
    return {
      label: `${late} day${late === 1 ? "" : "s"} overdue`,
      overdue: true,
      soon: false,
    };
  }
  return { label: `Due in ${days} days`, overdue: false, soon: days <= 3 };
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 && unit > 0 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function displayName(user: {
  name: string;
  title?: string | null;
}): string {
  return user.title ? `${user.title} ${user.name}` : user.name;
}

/**
 * Tailwind can only see class names that appear literally in the source, so
 * accents are a fixed lookup rather than an interpolated string.
 */
const AVATAR_ACCENTS: Record<string, string> = {
  indigo: "bg-indigo-100 text-indigo-700",
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
  amber: "bg-amber-100 text-amber-800",
  sky: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
  teal: "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-700",
};

export function avatarAccent(accent: string): string {
  return AVATAR_ACCENTS[accent] ?? AVATAR_ACCENTS.indigo;
}

export function percentage(score: number, maxScore: number): number {
  if (!maxScore) return 0;
  return Math.round((score / maxScore) * 100);
}

/** Colour band for a mark, used on score pills. */
export function scoreTone(score: number, maxScore: number): string {
  const pct = percentage(score, maxScore);
  if (pct >= 70) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (pct >= 50) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-rose-200";
}
