"use client";

import { useState } from "react";
import { CheckSquare2, Square, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgentConfirmationItem } from "@/types";

interface AgentConfirmationProps {
  agents: AgentConfirmationItem[];
  onConfirm: (selectedIds: string[]) => void;
  onCancel: () => void;
}

export function AgentConfirmation({ agents, onConfirm, onCancel }: AgentConfirmationProps) {
  const [items, setItems] = useState(agents);

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  }

  const selectedCount = items.filter((i) => i.enabled).length;

  return (
    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 max-w-[95%]">
      <p className="text-sm font-medium mb-3">
        AI 分析完成，计划调用以下 Agent:
      </p>
      <div className="space-y-1.5 mb-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className="flex items-center gap-2.5 w-full text-left px-2 py-1.5 rounded-lg hover:bg-background/50 transition-colors"
          >
            {item.enabled ? (
              <CheckSquare2 className="size-4 text-primary shrink-0" />
            ) : (
              <Square className="size-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.description}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="size-3.5 mr-1" />
          取消
        </Button>
        <Button
          size="sm"
          disabled={selectedCount === 0}
          onClick={() => onConfirm(items.filter((i) => i.enabled).map((i) => i.id))}
        >
          <Play className="size-3.5 mr-1" />
          确认执行 ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
