/**
 * Self-contained product mockups for the landing page — no external images.
 * They are stylised illustrations of the real screens (marking editor,
 * lecturer dashboard, student result), drawn with the app's own colours.
 */

/** An essay page with a lecturer's annotations drawn over it. */
function AnnotatedPageArt({ className = "" }: { className?: string }) {
  const line = (y: number, w: number, fill = "#e5e5e8") => (
    <rect x={26} y={y} width={w} height={6} rx={3} fill={fill} />
  );

  return (
    <svg
      viewBox="0 0 340 380"
      className={`text-accent-500 ${className}`}
      role="img"
      aria-label="An assignment page marked up by the lecturer"
    >
      <rect
        x={0.5}
        y={0.5}
        width={339}
        height={379}
        rx={10}
        fill="#ffffff"
        stroke="#e4e4e7"
      />

      {/* heading + body text */}
      {line(30, 190, "#cfcfd4")}
      {line(58, 288)}
      {line(74, 268)}
      {line(90, 280)}
      {line(120, 250)}
      {line(136, 286)}
      {line(152, 210)}
      {line(196, 276)}
      {line(212, 240)}
      {line(242, 282)}
      {line(258, 200)}
      {line(300, 260)}
      {line(316, 230)}

      {/* highlighter over a line */}
      <rect
        x={24}
        y={116}
        width={264}
        height={14}
        rx={3}
        fill="currentColor"
        opacity={0.24}
      />

      {/* wavy underline */}
      <path
        d="M28 100 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* circled passage + arrow from the margin */}
      <ellipse
        cx={150}
        cy={225}
        rx={140}
        ry={26}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        transform="rotate(-2 150 225)"
      />
      <path
        d="M322 180 C300 190 300 205 296 214"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M296 214 l7 -3 M296 214 l1 -7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* handwritten "Good!" */}
      <text
        x={236}
        y={64}
        fill="currentColor"
        fontSize={22}
        fontStyle="italic"
        fontWeight={700}
        transform="rotate(-8 236 64)"
      >
        Good!
      </text>

      {/* tick */}
      <path
        d="M300 300 l7 8 l14 -18"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrowserFrame({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-2xl shadow-brand-900/10 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-brand-100 bg-brand-50 px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-brand-200" />
        <span className="size-2.5 rounded-full bg-brand-200" />
        <span className="size-2.5 rounded-full bg-brand-200" />
        <span className="ml-2 hidden rounded-md bg-white px-3 py-1 text-[10px] font-medium text-brand-400 ring-1 ring-brand-100 sm:block">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/** Hero banner: the marking editor — annotated page beside the score panel. */
export function MarkingEditorMockup({ className = "" }: { className?: string }) {
  const toolDots = ["bg-accent-500", "bg-brand-800", "bg-brand-300"];

  return (
    <BrowserFrame title="fairmount.edu / marking" className={className}>
      <div className="grid gap-0 sm:grid-cols-[1.55fr_1fr]">
        <div className="border-b border-brand-100 p-4 sm:border-r sm:border-b-0">
          {/* editor toolbar */}
          <div className="mb-3 flex items-center gap-1.5">
            {toolDots.map((dot, i) => (
              <span key={i} className={`size-5 rounded-md ${dot}`} />
            ))}
            <span className="ml-1 h-5 w-px bg-brand-100" />
            <span className="size-5 rounded-md bg-brand-100" />
            <span className="size-5 rounded-md bg-brand-100" />
          </div>
          <AnnotatedPageArt className="w-full" />
        </div>

        <div className="flex flex-col gap-3 p-4">
          <p className="section-title">Marking</p>

          <div className="rounded-xl border border-brand-200 p-3">
            <p className="text-[10px] text-brand-400">Score</p>
            <p className="text-3xl font-bold text-brand-900">
              38<span className="text-lg text-brand-300">/40</span>
            </p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-100">
              <div className="h-full w-[95%] rounded-full bg-accent-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] text-brand-400">Comments</p>
            <span className="block h-2 w-full rounded bg-brand-100" />
            <span className="block h-2 w-11/12 rounded bg-brand-100" />
            <span className="block h-2 w-3/4 rounded bg-brand-100" />
          </div>

          <div className="mt-auto grid h-8 place-items-center rounded-lg bg-accent-500 text-[11px] font-bold text-white">
            Save marking
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Lecturer dashboard: stats and assignment rows with hand-in progress. */
export function DashboardMockup({ className = "" }: { className?: string }) {
  const rows = [
    { pct: 80, tone: "bg-accent-500" },
    { pct: 55, tone: "bg-accent-400" },
    { pct: 30, tone: "bg-brand-300" },
  ];

  return (
    <BrowserFrame title="fairmount.edu / lecturer" className={className}>
      <div className="p-4">
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          {[
            { label: "Assignments", value: "6" },
            { label: "Handed in", value: "23" },
            { label: "To mark", value: "5" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-brand-100 bg-brand-50/60 p-3"
            >
              <p className="text-[9px] font-bold tracking-wider text-brand-400 uppercase">
                {stat.label}
              </p>
              <p className="mt-1 text-xl font-bold text-brand-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          {rows.map((row, i) => (
            <div
              key={i}
              className="rounded-xl border border-brand-100 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="block h-2.5 w-32 rounded bg-brand-200" />
                <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[9px] font-bold text-accent-600">
                  Due soon
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100">
                <div
                  className={`h-full rounded-full ${row.tone}`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/** Student view: a marked page with the score and feedback returned. */
export function StudentResultMockup({ className = "" }: { className?: string }) {
  return (
    <BrowserFrame title="fairmount.edu / my coursework" className={className}>
      <div className="grid gap-0 sm:grid-cols-[1fr_1.15fr]">
        <div className="border-b border-brand-100 bg-brand-50/40 p-4 sm:border-r sm:border-b-0">
          <AnnotatedPageArt className="w-full" />
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <p className="section-title">Your result</p>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 ring-1 ring-emerald-200">
              Marked
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-brand-900">38</span>
            <span className="text-lg text-brand-300">/ 40</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              95%
            </span>
          </div>

          <div className="rounded-xl bg-brand-50 p-3">
            <div className="space-y-1.5">
              <span className="block h-2 w-full rounded bg-brand-200" />
              <span className="block h-2 w-10/12 rounded bg-brand-200" />
              <span className="block h-2 w-2/3 rounded bg-brand-200" />
            </div>
          </div>

          <p className="text-[10px] text-brand-400">
            Marked pages, score and comments — all in one place.
          </p>
        </div>
      </div>
    </BrowserFrame>
  );
}
