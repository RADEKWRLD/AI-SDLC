"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Session } from "@/types";

interface ProjectCardProps {
  session: Session;
  statusLabel: Record<string, string>;
  onEdit: (id: string, data: { title: string; description: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ProjectCard({ session, statusLabel, onEdit, onDelete }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);
  const [editDescription, setEditDescription] = useState(session.description || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onEdit(session.id, { title: editTitle, description: editDescription });
      setEditOpen(false);
    } catch {
      setError("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await onDelete(session.id);
      setDeleteOpen(false);
    } catch {
      setError("删除失败，请重试");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Link href={`/session/${session.id}`}>
        <Card className="card-hover cursor-pointer h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{session.title}</CardTitle>
              <Badge variant="secondary">
                {statusLabel[session.status] || session.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {session.description || "暂无描述"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--muted-foreground)]">
                {formatDistanceToNow(new Date(session.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-md p-1 hover:bg-[var(--accent)] transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="h-4 w-4" />
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-[var(--destructive)]"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑项目</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <Input
              placeholder="项目标题"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="项目描述（可选）"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
            />
            {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "保存中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--muted-foreground)]">
            确定要删除项目「{session.title}」吗？此操作无法撤销。
          </p>
          {error && <p className="text-sm text-[var(--destructive)] mt-2">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "删除中..." : "删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
