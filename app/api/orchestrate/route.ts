import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSessionById } from "@/lib/db/queries/sessions";
import { orchestrate } from "@/lib/ai/agents/orchestrator";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { sessionId, prompt } = body as { sessionId?: string; prompt?: string };

  if (!sessionId || !prompt) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const sessionData = await getSessionById(sessionId);
  if (!sessionData || sessionData.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const agents = await orchestrate(prompt);
    return NextResponse.json({ agents });
  } catch {
    return NextResponse.json({ error: "Orchestration failed" }, { status: 500 });
  }
}
