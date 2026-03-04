import { ai, AI_MODEL } from "@/lib/ai";
import { API_AGENT_PROMPT } from "@/lib/ai/prompts";

const MAX_PROMPT_LENGTH = 10000;
const MAX_CONTEXT_LENGTH = 20000;

export async function runAPIAgent(prompt: string, context?: string): Promise<string> {
  const safePrompt = prompt.slice(0, MAX_PROMPT_LENGTH);
  const safeContext = context?.slice(0, MAX_CONTEXT_LENGTH);

  const messages: { role: "system" | "user"; content: string }[] = [
    { role: "system", content: API_AGENT_PROMPT },
  ];

  if (safeContext) {
    messages.push({ role: "user", content: `已有上下文:\n${safeContext}\n\n需求:\n${safePrompt}` });
  } else {
    messages.push({ role: "user", content: safePrompt });
  }

  try {
    const response = await ai.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 4000,
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (err) {
    console.error("[APIAgent] API call failed:", err);
    throw new Error(`API 规范 Agent 调用失败: ${err instanceof Error ? err.message : String(err)}`);
  }
}
