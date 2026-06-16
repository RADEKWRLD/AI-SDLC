import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { sessionShares, shareLinks, sessions, users } from "@/lib/db/schema";
import { eq, and, desc, isNull, or, gt } from "drizzle-orm";
import { getUserByEmail } from "@/lib/db/queries/users";

// 当前用户是否有权查看该 session (owner 或被分享者)
export async function canViewSession(userId: string, sessionId: string) {
  const [own] = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
    .limit(1);
  if (own) return true;

  const [shared] = await db
    .select({ id: sessionShares.id })
    .from(sessionShares)
    .where(
      and(
        eq(sessionShares.sessionId, sessionId),
        eq(sessionShares.sharedWithUserId, userId)
      )
    )
    .limit(1);
  return Boolean(shared);
}

// 「分享给我的」项目列表 (附 owner 名称)
export async function getSharedSessions(userId: string) {
  return db
    .select({
      id: sessions.id,
      title: sessions.title,
      description: sessions.description,
      status: sessions.status,
      createdAt: sessions.createdAt,
      updatedAt: sessions.updatedAt,
      ownerName: users.name,
      ownerEmail: users.email,
    })
    .from(sessionShares)
    .innerJoin(sessions, eq(sessionShares.sessionId, sessions.id))
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessionShares.sharedWithUserId, userId))
    .orderBy(desc(sessions.updatedAt));
}

// 按邮箱邀请已注册成员; 返回 { ok } 或错误码
export async function addShareByEmail(
  sessionId: string,
  ownerId: string,
  email: string
): Promise<{ ok: true } | { ok: false; reason: "not_found" | "is_owner" }> {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false, reason: "not_found" };
  if (user.id === ownerId) return { ok: false, reason: "is_owner" };

  await db
    .insert(sessionShares)
    .values({ sessionId, sharedWithUserId: user.id })
    .onConflictDoNothing();
  return { ok: true };
}

// 列出某 session 的协作成员
export async function getSessionShares(sessionId: string) {
  return db
    .select({
      id: sessionShares.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      role: sessionShares.role,
      createdAt: sessionShares.createdAt,
    })
    .from(sessionShares)
    .innerJoin(users, eq(sessionShares.sharedWithUserId, users.id))
    .where(eq(sessionShares.sessionId, sessionId))
    .orderBy(desc(sessionShares.createdAt));
}

export async function removeShare(sessionId: string, shareId: string) {
  await db
    .delete(sessionShares)
    .where(
      and(eq(sessionShares.id, shareId), eq(sessionShares.sessionId, sessionId))
    );
}

// 获取该 session 的分享链接 (无则创建)
export async function getOrCreateShareLink(sessionId: string) {
  const [existing] = await db
    .select()
    .from(shareLinks)
    .where(eq(shareLinks.sessionId, sessionId))
    .limit(1);
  if (existing) return existing;

  const token = randomBytes(16).toString("hex");
  const [created] = await db
    .insert(shareLinks)
    .values({ sessionId, token })
    .returning();
  return created;
}

export async function getShareLink(sessionId: string) {
  const [link] = await db
    .select()
    .from(shareLinks)
    .where(eq(shareLinks.sessionId, sessionId))
    .limit(1);
  return link ?? null;
}

// 凭 token 取有效 (未过期) 分享链接
export async function getShareLinkByToken(token: string) {
  const [link] = await db
    .select()
    .from(shareLinks)
    .where(
      and(
        eq(shareLinks.token, token),
        or(isNull(shareLinks.expiresAt), gt(shareLinks.expiresAt, new Date()))
      )
    )
    .limit(1);
  return link ?? null;
}

export async function revokeShareLink(sessionId: string) {
  await db.delete(shareLinks).where(eq(shareLinks.sessionId, sessionId));
}
