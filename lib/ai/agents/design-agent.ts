import { ai, AI_MODEL } from "@/lib/ai";
import { DESIGN_AGENT_PROMPT } from "@/lib/ai/prompts";

const MAX_PROMPT_LENGTH = 10000;
const MAX_CONTEXT_LENGTH = 20000;

export async function runDesignAgent(prompt: string, existingCode?: string): Promise<string> {
  const safePrompt = prompt.slice(0, MAX_PROMPT_LENGTH);
  let userContent = safePrompt;
  if (existingCode) {
    userContent = `已有架构图（需保持结构一致性并演化）:\n${existingCode.slice(0, MAX_CONTEXT_LENGTH)}\n\n新需求:\n${safePrompt}`;
  }

  try {
    const response = await ai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: DESIGN_AGENT_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content?.trim() || "";
    // Strip markdown code fences if present
    return content.replace(/^```mermaid\n?/i, "").replace(/\n?```$/i, "").trim();
  } catch (err) {
    console.error("[DesignAgent] API call failed:", err);
    throw new Error(`架构图 Agent 调用失败: ${err instanceof Error ? err.message : String(err)}`);
  }
}
