import { ai, AI_MODEL } from "@/lib/ai";
import { PLAN_AGENT_PROMPT } from "@/lib/ai/prompts";

const MAX_PROMPT_LENGTH = 10000;
const MAX_CONTEXT_LENGTH = 20000;

export async function runPlanAgent(prompt: string, context?: string): Promise<string> {
  const safePrompt = prompt.slice(0, MAX_PROMPT_LENGTH);
  const safeContext = context?.slice(0, MAX_CONTEXT_LENGTH);

  const messages: { role: "system" | "user"; content: string }[] = [
    { role: "system", content: PLAN_AGENT_PROMPT },
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
    console.error("[PlanAgent] API call failed:", err);
    throw new Error(`发展计划 Agent 调用失败: ${err instanceof Error ? err.message : String(err)}`);
  }
}
