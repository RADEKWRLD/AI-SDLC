import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSharedSessions } from "@/lib/db/queries/shares";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sessions = await getSharedSessions(session.user.id);
  return NextResponse.json({ sessions });
}
