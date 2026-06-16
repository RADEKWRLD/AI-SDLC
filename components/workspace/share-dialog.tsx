"use client";

import { useEffect, useState, useCallback } from "react";
import { Link2, Copy, Check, Trash2, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ShareMember, ShareLink } from "@/types";

interface ShareDialogProps {
  sessionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ sessionId, open, onOpenChange }: ShareDialogProps) {
  const [members, setMembers] = useState<ShareMember[]>([]);
  const [link, setLink] = useState<ShareLink | null>(null);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/sessions/${sessionId}/shares`);
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members);
      setLink(data.link);
    }
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    if (open) {
      setError("");
      setCopied(false);
      load();
    }
  }, [open, load]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    setError("");
    try {
      const res = await fetch(`/api/sessions/${sessionId}/shares`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "邀请失败");
        return;
      }
      setMembers(data.members);
      setEmail("");
    } catch {
      setError("邀请失败，请重试");
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(shareId: string) {
    const res = await fetch(`/api/sessions/${sessionId}/shares/${shareId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== shareId));
    }
  }

  async function handleCreateLink() {
    const res = await fetch(`/api/sessions/${sessionId}/share-link`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setLink(data.link);
    }
  }

  async function handleRevokeLink() {
    const res = await fetch(`/api/sessions/${sessionId}/share-link`, {
      method: "DELETE",
    });
    if (res.ok) setLink(null);
  }

  function shareUrl() {
    if (!link) return "";
    return `${window.location.origin}/share/${link.token}`;
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>分享项目</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 邀请成员 */}
          <div className="space-y-3">
            <p className="text-sm font-medium">邀请成员（仅查看）</p>
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="输入对方注册邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" disabled={inviting || !email.trim()}>
                <UserPlus className="h-4 w-4" />
                {inviting ? "邀请中" : "邀请"}
              </Button>
            </form>
            {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}

            <div className="space-y-1">
              {loading ? (
                <p className="text-xs text-[var(--muted-foreground)]">加载中...</p>
              ) : members.length === 0 ? (
                <p className="text-xs text-[var(--muted-foreground)]">还没有协作成员</p>
              ) : (
                members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-md px-3 py-2 bg-[var(--secondary)]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm truncate">{m.name || m.email}</p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {m.email} · 可查看
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(m.id)}
                      title="移除"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 分享链接 */}
          <div className="space-y-3 border-t border-[var(--border)] pt-4">
            <p className="text-sm font-medium">分享链接（任何人可查看）</p>
            {link ? (
              <>
                <div className="flex gap-2">
                  <Input readOnly value={shareUrl()} className="font-mono text-xs" />
                  <Button variant="outline" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRevokeLink} className="text-[var(--destructive)]">
                  <Trash2 className="h-4 w-4" />
                  撤销链接
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleCreateLink}>
                <Link2 className="h-4 w-4" />
                创建分享链接
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
