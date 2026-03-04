import { AI_MODEL } from "@/lib/ai";
import { env } from "@/lib/env";
import { CONVERSATION_AGENT_PROMPT } from "@/lib/ai/prompts";

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_HISTORY_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 4000;

/**
 * Streaming conversation agent using raw fetch to avoid OpenAI SDK
 * serialization issues with DeepSeek's streaming endpoint.
 * Yields token chunks; caller detects [READY] in accumulated text.
 */
export async function* runConversationAgent(
  history: ConversationMessage[]
): AsyncGenerator<string> {
  const safeHistory = history
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_CONTENT_LENGTH),
    }));

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: CONVERSATION_AGENT_PROMPT },
        ...safeHistory,
      ],
      temperature: 0.7,
      max_tokens: 800,
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

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          yield delta;
        }
      } catch {
        // skip unparseable lines
      }
    }
  }
}
