"use client";

import Link from "next/link";
import { useState } from "react";

import { saveMarking } from "@/lib/actions/marking";

/**
 * Score and comments without the drawing editor — used for file types that
 * cannot be rendered as a page (Word documents, plain text, and so on).
 */
export function GradeForm({
  submissionId,
  maxScore,
  initialScore,
  initialFeedback,
  backHref,
}: {
  submissionId: string;
  maxScore: number;
  initialScore: number | null;
  initialFeedback: string;
  backHref: string;
}) {
  const [score, setScore] = useState(initialScore?.toString() ?? "");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setStatus("saving");
    setError(null);

    const result = await saveMarking({
      submissionId,
      page: 1,
      overlay: null,
      strokes: [],
      score,
      feedback,
    });

    if (result.error) {
      setError(result.error);
      setStatus("idle");
      return;
    }
    setStatus("saved");
  }

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="section-title">Marking</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
        <div>
          <label htmlFor="score" className="field-label">
            Score
          </label>
          <div className="flex items-center gap-2">
            <input
              id="score"
              type="number"
              min={0}
              max={maxScore}
              step="0.5"
              value={score}
              onChange={(event) => {
                setScore(event.target.value);
                setStatus("idle");
              }}
              placeholder="—"
              className="input"
            />
            <span className="mt-1.5 shrink-0 text-sm font-semibold text-brand-400">
              / {maxScore}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="feedback" className="field-label">
            Comments
          </label>
          <textarea
            id="feedback"
            rows={5}
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
              setStatus("idle");
            }}
            placeholder="What went well, what to work on…"
            className="input"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="btn-primary"
        >
          {status === "saving" ? "Saving…" : "Save marking"}
        </button>
        <Link href={backHref} className="btn-secondary">
          Done
        </Link>
        {error && (
          <p className="text-xs font-semibold text-rose-600">{error}</p>
        )}
        {status === "saved" && !error && (
          <p className="text-xs font-semibold text-emerald-600">
            Saved. The student can see this now.
          </p>
        )}
      </div>
    </div>
  );
}
