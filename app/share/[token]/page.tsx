import { getShareLinkByToken } from "@/lib/db/queries/shares";
import { getSessionById } from "@/lib/db/queries/sessions";
import { getSessionDocuments } from "@/lib/db/queries/documents";
import { PreviewPanel } from "@/components/workspace/preview-panel";
import type { Document } from "@/types";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await getShareLinkByToken(token);

  if (!link) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-lg font-semibold">链接已失效</p>
        <p className="text-sm text-[var(--muted-foreground)]">
          该分享链接不存在或已被撤销。
        </p>
      </div>
    );
  }

  const session = await getSessionById(link.sessionId);
  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-lg font-semibold">项目不存在</p>
      </div>
    );
  }

  const docs = await getSessionDocuments(link.sessionId);
  // 按类型分组取每类最新版本 (与 session 页面一致)
  const grouped: Record<string, Document | null> = {
    mermaid: null,
    er: null,
    api_spec: null,
    arch_design: null,
    dev_plan: null,
  };
  for (const doc of docs as Document[]) {
    const key =
      doc.type === "mermaid"
        ? doc.diagramType === "er"
          ? "er"
          : "mermaid"
        : doc.type;
    if (!grouped[key] || doc.version > (grouped[key]?.version ?? 0)) {
      grouped[key] = doc;
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="shrink-0 border-b border-[var(--border)] px-6 py-3">
        <h1 className="text-lg font-semibold">{session.title}</h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          只读分享 · 由 AI-SDLC 生成
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <PreviewPanel documents={grouped} readOnly />
      </div>
    </div>
  );
}
