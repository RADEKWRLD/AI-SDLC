import type { AgentType } from "./agents/orchestrator";

export const AGENT_LABELS: Record<AgentType, string> = {
  requirement: "需求分析",
  design: "架构图",
  er: "ER 图",
  api: "API 规范",
  plan: "发展计划",
};

export const AGENT_DESCRIPTIONS: Record<AgentType, string> = {
  requirement: "整理为结构化功能需求文档",
  design: "生成系统架构图 (Mermaid)",
  er: "生成数据库 ER 图 (Mermaid)",
  api: "生成 RESTful API 接口文档",
  plan: "生成项目迭代规划文档",
};
