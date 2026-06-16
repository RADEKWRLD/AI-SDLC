import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSessionById } from "@/lib/db/queries/sessions";
import {
  getSessionShares,
  addShareByEmail,
  getShareLink,
} from "@/lib/db/queries/shares";
import { inviteShareSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sessionData = await getSessionById(id);
  // 仅 owner 可管理分享
  if (!sessionData || sessionData.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [members, link] = await Promise.all([
    getSessionShares(id),
    getShareLink(id),
  ]);
  return NextResponse.json({ members, link });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sessionData = await getSessionById(id);
  if (!sessionData || sessionData.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = inviteShareSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const result = await addShareByEmail(id, session.user.id, parsed.data.email);
  if (!result.ok) {
    const message =
      result.reason === "not_found" ? "该邮箱尚未注册" : "无法分享给项目所有者";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const members = await getSessionShares(id);
  return NextResponse.json({ members }, { status: 201 });
}
