import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Receives the result of the virus detection task.
 *
 * Virus detection is a Workflows task, not a URL task: it runs asynchronously
 * after the file lands in storage, and the verdict arrives here rather than in
 * a response to something the browser asked for. Configure the workflow in the
 * Filestack dashboard and point its webhook at this route.
 *
 * https://www.filestack.com/docs/transformations/intelligence/virus-detection/
 */
type Verdict = { infected: boolean; infections_list: string[] };

// A demo-scale store. In production this is a row on the attachment.
const verdicts = new Map<string, Verdict>();

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const body = payload as {
    handle?: string;
    data?: Verdict;
    results?: Record<string, { data?: Verdict }>;
  };

  // Workflows nests task output under the task name you chose, so accept both
  // the flat shape and the per-task shape.
  const verdict =
    body.data ??
    Object.values(body.results ?? {}).find((entry) => entry.data)?.data;

  if (!body.handle || !verdict) {
    return NextResponse.json({ error: "Expected a handle and a verdict" }, { status: 400 });
  }

  verdicts.set(body.handle, verdict);
  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const handle = new URL(request.url).searchParams.get("handle");
  if (!handle) {
    return NextResponse.json({ error: "handle is required" }, { status: 400 });
  }

  const verdict = verdicts.get(handle);
  return NextResponse.json({
    handle,
    status: verdict ? "complete" : "pending",
    ...(verdict ?? {}),
  });
}
