"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Tool } from "@/components/ui/tool";
import type { AgentProcessMetadata } from "@/types";

interface Props {
  metadata: AgentProcessMetadata;
}

export function PersistedThinkingChain({ metadata }: Props) {
  const { steps = [], tools = [] } = metadata;

  if (steps.length === 0 && tools.length === 0) return null;

  return (
    <div className="space-y-1 min-w-70 max-w-[95%]">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2 text-sm px-1 py-0.5">
          {step.status === "done" && (
            <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
          )}
          {step.status === "error" && (
            <XCircle className="size-3.5 text-destructive shrink-0" />
          )}
          <span className={step.status === "error" ? "text-destructive" : "text-muted-foreground"}>
            {step.label}
          </span>
        </div>
      ))}
      {tools.map((tool) => (
        <Tool
          key={tool.agent}
          toolPart={{
            type: tool.label,
            state: tool.state,
            toolCallId: tool.agent,
            errorText: tool.errorText,
          }}
          defaultOpen={false}
        />
      ))}
    </div>
  );
}
