export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "getting-started",
    title: "CycleMind 快速上手指南",
    date: "2026-04-01",
    excerpt: "从注册到生成第一份完整设计文档，只需五分钟。本文带你了解 CycleMind 的核心工作流。",
    tags: ["教程", "入门"],
  },
  {
    slug: "ai-architecture-generation",
    title: "AI 如何自动生成系统架构图",
    date: "2026-03-30",
    excerpt: "深入解析 Design Agent 的工作原理：从自然语言需求到 Mermaid 架构图的完整生成链路。",
    tags: ["AI", "架构"],
  },
  {
    slug: "er-diagram-best-practices",
    title: "ER 图设计最佳实践：从需求到数据模型",
    date: "2026-03-28",
    excerpt: "好的数据库设计是系统稳定运行的基石。掌握 ER 图的核心原则，避免常见的建模陷阱。",
    tags: ["ER图", "最佳实践"],
  },
  {
    slug: "natural-language-to-api",
    title: "自然语言转 API 规范：原理与实践",
    date: "2026-03-26",
    excerpt: "API Agent 如何从架构描述中提取端点、参数和认证信息，自动输出完整的接口规范文档。",
    tags: ["API设计", "AI"],
  },
  {
    slug: "sprint-planning-with-ai",
    title: "用 AI 生成 Sprint 开发计划",
    date: "2026-03-24",
    excerpt: "Plan Agent 将架构决策拆解为可执行的任务列表，智能分配优先级并推荐合理的开发时间线。",
    tags: ["AI", "团队协作"],
  },
  {
    slug: "requirement-analysis-automation",
    title: "需求分析自动化：告别遗漏与歧义",
    date: "2026-03-22",
    excerpt: "Requirement Agent 如何结构化你的自然语言需求，识别隐含假设并补全缺失的边界条件。",
    tags: ["AI", "最佳实践"],
  },
  {
    slug: "mermaid-diagrams-deep-dive",
    title: "Mermaid 图表深度解析：架构可视化利器",
    date: "2026-03-20",
    excerpt: "全面掌握 Mermaid 语法，从流程图到序列图，让架构设计既精确又美观。",
    tags: ["架构", "技术深度"],
  },
  {
    slug: "microservices-vs-monolith",
    title: "微服务 vs 单体架构：AI 如何辅助决策",
    date: "2026-03-18",
    excerpt: "不同规模的项目该选什么架构？CycleMind 根据需求复杂度自动推荐最适合的架构模式。",
    tags: ["架构", "AI"],
  },
  {
    slug: "database-design-patterns",
    title: "数据库设计模式：AI 驱动的范式选择",
    date: "2026-03-16",
    excerpt: "从第一范式到反范式化，了解 ER Agent 如何根据业务场景智能选择数据库设计策略。",
    tags: ["ER图", "技术深度"],
  },
  {
    slug: "restful-api-design-guide",
    title: "RESTful API 设计规范完整指南",
    date: "2026-03-14",
    excerpt: "URL 命名、HTTP 方法、状态码、分页、错误处理——一篇文章覆盖 RESTful 设计的核心规范。",
    tags: ["API设计", "最佳实践"],
  },
  {
    slug: "version-control-for-designs",
    title: "设计文档版本控制：追踪每一次变更",
    date: "2026-03-12",
    excerpt: "CycleMind 的 append-only 版本机制如何实现设计文档的完整历史追踪与差异对比。",
    tags: ["产品更新", "团队协作"],
  },
  {
    slug: "multi-agent-orchestration",
    title: "多 Agent 协同：CycleMind 的编排引擎揭秘",
    date: "2026-03-10",
    excerpt: "Orchestrator 如何智能拆解任务、调度五大 Agent 并行运行，并通过 SSE 实时推送进度。",
    tags: ["AI", "技术深度"],
  },
  {
    slug: "from-idea-to-prototype",
    title: "从想法到原型：30 分钟完成系统设计",
    date: "2026-03-08",
    excerpt: "实战教程：用一段需求描述，在 CycleMind 中快速生成完整的系统设计文档全家桶。",
    tags: ["教程", "入门"],
  },
  {
    slug: "api-versioning-strategies",
    title: "API 版本策略：向前兼容的设计哲学",
    date: "2026-03-06",
    excerpt: "URL 路径版本、Header 版本、查询参数版本——三种主流方案的优劣分析与选型建议。",
    tags: ["API设计", "最佳实践"],
  },
  {
    slug: "scaling-database-schema",
    title: "数据库 Schema 演进：AI 辅助的迁移方案",
    date: "2026-03-04",
    excerpt: "需求变更后数据库该怎么改？了解 AI 如何自动生成安全的 Schema 迁移脚本。",
    tags: ["ER图", "工程效率"],
  },
  {
    slug: "team-collaboration-workflows",
    title: "团队协作工作流：多人共编设计文档",
    date: "2026-03-02",
    excerpt: "从个人项目到团队协作，CycleMind 如何支持多人并行编辑与版本合并。",
    tags: ["团队协作", "产品更新"],
  },
  {
    slug: "security-by-design",
    title: "安全设计优先：AI 自动识别安全风险",
    date: "2026-02-28",
    excerpt: "在架构阶段就发现潜在的安全隐患——SQL 注入、XSS、CSRF 等常见漏洞的自动检测。",
    tags: ["架构", "最佳实践"],
  },
  {
    slug: "graphql-vs-rest",
    title: "GraphQL vs REST：AI 帮你选技术方案",
    date: "2026-02-26",
    excerpt: "两种 API 风格各有优劣，CycleMind 根据数据关系复杂度自动推荐最合适的方案。",
    tags: ["API设计", "AI"],
  },
  {
    slug: "event-driven-architecture",
    title: "事件驱动架构：异步系统的设计之道",
    date: "2026-02-24",
    excerpt: "消息队列、事件总线、CQRS——深入理解事件驱动架构的核心模式与适用场景。",
    tags: ["架构", "技术深度"],
  },
  {
    slug: "testing-strategy-generation",
    title: "AI 生成测试策略：从单元测试到集成测试",
    date: "2026-02-22",
    excerpt: "基于架构图和 API 规范，AI 自动推导测试用例覆盖矩阵和测试优先级。",
    tags: ["AI", "工程效率"],
  },
  {
    slug: "domain-driven-design",
    title: "领域驱动设计与 AI：自动识别限界上下文",
    date: "2026-02-20",
    excerpt: "DDD 的核心概念如何与 AI 结合？自动从需求中提取领域模型和上下文边界。",
    tags: ["架构", "AI"],
  },
  {
    slug: "performance-optimization-guide",
    title: "性能优化指南：架构层面的瓶颈分析",
    date: "2026-02-18",
    excerpt: "缓存策略、读写分离、CDN 加速——在架构设计阶段就规避性能瓶颈的实用指南。",
    tags: ["架构", "最佳实践"],
  },
  {
    slug: "ci-cd-pipeline-design",
    title: "CI/CD 流水线设计：从设计文档到部署",
    date: "2026-02-16",
    excerpt: "打通设计与交付的最后一公里：如何基于架构文档自动生成 CI/CD 配置模板。",
    tags: ["工程效率", "最佳实践"],
  },
  {
    slug: "case-study-ecommerce",
    title: "案例分析：电商系统从需求到架构全流程",
    date: "2026-02-14",
    excerpt: "以一个完整的电商项目为例，展示 CycleMind 如何在 30 分钟内输出全套设计文档。",
    tags: ["案例分析", "教程"],
  },
  {
    slug: "future-of-ai-software-design",
    title: "AI 软件设计的未来：2026 趋势展望",
    date: "2026-02-12",
    excerpt: "从代码生成到架构生成，AI 正在重塑软件工程的每一个环节。展望未来趋势与机遇。",
    tags: ["AI", "技术深度"],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}
