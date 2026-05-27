export type AgentType = "requirement" | "design" | "er" | "api" | "plan";

export const AGENT_TYPES: AgentType[] = ["requirement", "design", "er", "api", "plan"];

export function isAgentType(value: unknown): value is AgentType {
  return typeof value === "string" && (AGENT_TYPES as string[]).includes(value);
}

export const TRIGGER_GENERATION_TOOL = {
  type: "function" as const,
  function: {
    name: "trigger_generation",
    description:
      "当用户的需求已经清晰，且用户希望生成文档时调用。根据完整对话历史决定要触发哪些 agent 生成对应文档，并提供一段需求总结作为后续 agent 的生成上下文。一旦调用该工具，前端会展示确认面板，用户确认后才会真正执行生成。",
    parameters: {
      type: "object",
      required: ["agents", "summary", "reasoning"],
      properties: {
        agents: {
          type: "array",
          items: { type: "string", enum: AGENT_TYPES },
          minItems: 1,
          description:
            "要调用的 agent 列表。requirement=结构化需求文档；design=系统架构图(Mermaid)；er=数据库 ER 图(Mermaid)；api=RESTful API 规范；plan=项目发展计划。根据用户实际需求选择,不要全选。",
        },
        summary: {
          type: "string",
          description: "对当前需求的简短总结(<300字),会作为上下文一并传给被触发的 agent。要包含项目目标、核心功能、技术约束等关键信息。",
        },
        reasoning: {
          type: "string",
          description: "为什么选择这几个 agent 的简短决策理由(<200字),会存进消息 metadata 便于复盘。",
        },
      },
    },
  },
};

export type TriggerGenerationArgs = {
  agents: AgentType[];
  summary: string;
  reasoning: string;
};
