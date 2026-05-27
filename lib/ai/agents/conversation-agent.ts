import { AI_MODEL } from "@/lib/ai";
import { env } from "@/lib/env";
import { CONVERSATION_AGENT_PROMPT } from "@/lib/ai/prompts";
import {
  TRIGGER_GENERATION_TOOL,
  type AgentType,
  type TriggerGenerationArgs,
  isAgentType,
} from "@/lib/ai/tools";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ConversationEvent =
  | { type: "token"; text: string }
  | {
      type: "tool_call";
      agents: AgentType[];
      summary: string;
      reasoning: string;
    };

const MAX_HISTORY_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 4000;

type ToolCallAcc = {
  name?: string;
  argsBuffer: string;
};

export async function* runConversationAgent(
  history: ConversationMessage[],
  userContext?: string,
): AsyncGenerator<ConversationEvent> {
  const safeHistory = history
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_CONTENT_LENGTH),
    }));

  const systemPrompt = userContext
    ? `${CONVERSATION_AGENT_PROMPT}\n\n---\n以下是用户的个人信息文档 (user.md)，请参考其中的偏好和约定：\n${userContext.slice(0, 4000)}`
    : CONVERSATION_AGENT_PROMPT;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...safeHistory,
      ],
      tools: [TRIGGER_GENERATION_TOOL],
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 1200,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${response.status} ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  const toolCalls = new Map<number, ToolCallAcc>();

  outer: while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") break outer;

      let parsed: unknown;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }

      const delta = (parsed as { choices?: Array<{ delta?: unknown }> })
        .choices?.[0]?.delta as
        | {
            content?: string;
            tool_calls?: Array<{
              index: number;
              id?: string;
              function?: { name?: string; arguments?: string };
            }>;
          }
        | undefined;

      if (!delta) continue;

      if (typeof delta.content === "string" && delta.content.length > 0) {
        yield { type: "token", text: delta.content };
      }

      if (Array.isArray(delta.tool_calls)) {
        for (const tc of delta.tool_calls) {
          const slot = toolCalls.get(tc.index) ?? { argsBuffer: "" };
          if (tc.function?.name) slot.name = tc.function.name;
          if (typeof tc.function?.arguments === "string") {
            slot.argsBuffer += tc.function.arguments;
          }
          toolCalls.set(tc.index, slot);
        }
      }
    }
  }

  for (const slot of toolCalls.values()) {
    if (slot.name !== "trigger_generation") continue;
    let parsedArgs: Partial<TriggerGenerationArgs> = {};
    try {
      parsedArgs = JSON.parse(slot.argsBuffer) as Partial<TriggerGenerationArgs>;
    } catch {
      continue;
    }

    const rawAgents = Array.isArray(parsedArgs.agents) ? parsedArgs.agents : [];
    const agents = Array.from(new Set(rawAgents.filter(isAgentType)));
    if (agents.length === 0) continue;

    yield {
      type: "tool_call",
      agents,
      summary: (parsedArgs.summary ?? "").toString().slice(0, 2000),
      reasoning: (parsedArgs.reasoning ?? "").toString().slice(0, 1000),
    };
  }
}
