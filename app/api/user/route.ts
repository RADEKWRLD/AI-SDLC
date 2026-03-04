import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserById, updateUserMd, updateUserPreferences } from "@/lib/db/queries/users";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      userMd: user.userMd,
      preferences: user.preferences,
    },
  });
}

export async function PATCH(req: Request) {
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

  try {
    if (body.userMd !== undefined) {
      const user = await updateUserMd(session.user.id, body.userMd as string);
      return NextResponse.json({ user });
    }

    if (body.preferences !== undefined) {
      const user = await updateUserPreferences(session.user.id, body.preferences as Record<string, unknown>);
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
