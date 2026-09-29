/** What ran, in plain English, so a visitor can follow along. */
export function TaskChip({
  task,
  state = "idle",
}: {
  task: string;
  state?: "idle" | "running" | "done" | "error";
}) {
  const tone =
    state === "done"
      ? { bg: "rgba(16,185,129,.12)", fg: "#0f9d6a" }
      : state === "running"
        ? { bg: "color-mix(in srgb, var(--accent) 14%, transparent)", fg: "var(--accent)" }
        : state === "error"
          ? { bg: "rgba(244,63,94,.12)", fg: "#e11d48" }
          : { bg: "var(--brand-50)", fg: "var(--brand-500)" };

  return (
    <span className="pill" style={{ background: tone.bg, color: tone.fg }}>
      {state === "running" && (
        <span
          className="size-1.5 animate-pulse rounded-full"
          style={{ background: "currentColor" }}
        />
      )}
      {task}
    </span>
  );
}
