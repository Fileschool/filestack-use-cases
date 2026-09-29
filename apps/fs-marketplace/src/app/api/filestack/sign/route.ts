import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CDN = "https://cdn.filestackcontent.com";

/** Tasks this route is willing to sign. Anything else is rejected. */
const ALLOWED = /^(ocr|envelope_ocr|doc_detection(=[a-z_]+:(true|false)(,[a-z_]+:(true|false))*)?)$/;

/** How long a signed URL stays valid. Short, because it is handed to a browser. */
const TTL_SECONDS = 60 * 10;

type Body = { handle?: string; tasks?: string[] };

/**
 * Builds a signed Filestack URL.
 *
 * ocr, envelope_ocr and doc_detection reject unsigned requests, so the policy
 * has to be signed with the app secret. That secret never leaves the server:
 * the browser posts a handle and a task list and gets back a finished URL.
 *
 * https://www.filestack.com/docs/security/
 */
export async function POST(request: Request) {
  const secret = process.env.FILESTACK_APP_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "FILESTACK_APP_SECRET is not set. The Intelligence tasks reject unsigned requests, so this route cannot build a URL without it.",
      },
      { status: 501 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const handle = body.handle?.trim();
  const tasks = body.tasks ?? [];

  if (!handle || !/^[A-Za-z0-9_-]+$/.test(handle)) {
    return NextResponse.json({ error: "A valid file handle is required" }, { status: 400 });
  }
  if (tasks.length === 0) {
    return NextResponse.json({ error: "At least one task is required" }, { status: 400 });
  }
  for (const task of tasks) {
    if (!ALLOWED.test(task)) {
      return NextResponse.json({ error: `Task not allowed: ${task}` }, { status: 400 });
    }
  }

  // A policy is base64 JSON; the signature is its HMAC-SHA256 under the secret.
  const policy = JSON.stringify({
    expiry: Math.floor(Date.now() / 1000) + TTL_SECONDS,
    call: ["read", "convert"],
    handle,
  });

  const encodedPolicy = Buffer.from(policy).toString("base64");
  const signature = createHmac("sha256", secret).update(encodedPolicy).digest("hex");

  const url = [
    CDN,
    `security=p:${encodedPolicy},s:${signature}`,
    ...tasks,
    handle,
  ].join("/");

  return NextResponse.json({ url, expiresIn: TTL_SECONDS });
}
