# CycleMind — AI 驱动的软件设计自动化平台

## 1. 项目概述

CycleMind（AI-SDLC）是一个基于 AI 的软件生命周期辅助系统，用户输入自然语言需求后，系统通过多 Agent 并行协作，自动生成五类设计产物：

| 产物 | Agent | 存储类型 | 格式 |
|------|-------|----------|------|
| 架构图 | design | `mermaid` / `architecture` | Mermaid graph TD |
| ER 图 | er | `mermaid` / `er` | Mermaid erDiagram |
| 需求分析 | requirement | `arch_design` | Markdown |
| API 规范 | api | `api_spec` | Markdown |
| 发展计划 | plan | `dev_plan` | Markdown |

---

## 2. 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16 (App Router, Turbopack) |
| 语言 | TypeScript, React 19 |
| 样式 | Tailwind CSS v4, GSAP 动画 |
| 数据库 | Neon PostgreSQL + Drizzle ORM |
| 认证 | Auth.js v5 (Credentials + GitHub OAuth), JWT |
| AI | DeepSeek API (OpenAI SDK 兼容) |
| 状态管理 | Zustand |
| 图表渲染 | Mermaid.js (客户端 dynamic import) |
| Markdown | react-markdown + Shiki 语法高亮 |
| 部署 | Vercel |

---

## 3. 系统架构

```
┌────────────────────────────────────────────────────┐
│                   Frontend (Next.js)               │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ ChatPanel │  │ PreviewPanel │  │   Sidebar    │ │
│  │  (对话)   │  │ (5 Tab 预览)  │  │ (导航/模板)  │ │
│  └─────┬────┘  └──────┬───────┘  └──────────────┘ │
│        │ SSE           │ fetch                      │
└────────┼───────────────┼───────────────────────────┘
         │               │
         ▼               ▼
┌────────────────────────────────────────────────────┐
│                API Routes (Next.js)                │
│  POST /api/generate          ← SSE 流式响应        │
│  CRUD /api/sessions          ← 会话管理            │
│  CRUD /api/sessions/[id]/documents ← 文档 CRUD     │
│  CRUD /api/sessions/[id]/messages  ← 消息 CRUD     │
│  POST /api/register          ← 用户注册            │
│  GET  /api/user              ← 用户配置            │
│  GET  /api/templates         ← 模板列表            │
└─────────────────────┬──────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────┐
│              AI Agent Layer (DeepSeek)             │
│  ┌────────────┐                                    │
│  │Orchestrator│ ── 分析 prompt → 选择 Agent 组合   │
│  └─────┬──────┘                                    │
│        ├── RequirementAgent (需求结构化)            │
│        ├── DesignAgent      (架构图生成)            │
│        ├── ERAgent          (ER 图生成)             │
│        ├── APIAgent         (API 规范生成)          │
│        └── PlanAgent        (发展计划生成)          │
│        ↑ 并行执行, SSE 逐个回传                     │
└─────────────────────┬──────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────┐
│             Neon PostgreSQL (Drizzle ORM)          │
│  users · accounts · sessions · documents           │
│  messages · templates · auth_sessions              │
└────────────────────────────────────────────────────┘
```

---

## 4. 目录结构

```
app/
├── (auth)/login/           # 登录页
├── (auth)/register/        # 注册页
├── (dashboard)/dashboard/  # 项目列表
├── (dashboard)/session/[id]/ # 工作台主页面
├── (dashboard)/profile/    # 用户配置 (user.md)
├── api/generate/           # AI 生成 (SSE)
├── api/sessions/           # 会话 CRUD
├── api/sessions/[id]/documents/ # 文档 CRUD
├── api/sessions/[id]/messages/  # 消息 CRUD
├── api/register/           # 注册
├── api/user/               # 用户配置
├── api/templates/          # 模板
└── api/auth/[...nextauth]/ # Auth.js

lib/
├── ai/
│   ├── index.ts            # DeepSeek 客户端配置
│   ├── prompts.ts          # 所有 Agent 的 System Prompt
│   └── agents/
│       ├── orchestrator.ts # 编排器：分析 prompt → 选择 Agent
│       ├── requirement-agent.ts
│       ├── design-agent.ts
│       ├── er-agent.ts
│       ├── api-agent.ts
│       └── plan-agent.ts
├── auth/index.ts           # Auth.js 配置 (Credentials + GitHub)
├── db/
│   ├── index.ts            # Neon + Drizzle 连接
│   ├── schema.ts           # 表定义 + 枚举 + 关系
│   └── queries/            # 按实体封装的查询函数
│       ├── users.ts
│       ├── sessions.ts
│       ├── documents.ts
│       ├── messages.ts
│       └── templates.ts
└── validations.ts          # Zod 校验 schema

components/
├── ui/                     # 基础 UI (Button, Dialog, Avatar, etc.)
│   ├── markdown-renderer.tsx  # Markdown + Shiki 渲染
│   ├── message.tsx         # 消息气泡
│   ├── prompt-input.tsx    # 输入框
│   └── tool.tsx            # Agent 工具状态展示
├── layout/
│   ├── header.tsx          # 顶部栏
│   ├── sidebar.tsx         # 侧边导航
│   ├── sidebar-recent.tsx  # 最近项目列表
│   └── sidebar-templates.tsx # 模板选择弹窗
├── workspace/
│   ├── chat-panel.tsx      # 对话面板 (消息 + 思维链)
│   ├── preview-panel.tsx   # 预览面板 (5 Tab 切换)
│   ├── mermaid-renderer.tsx # Mermaid 渲染 (缩放/平移)
│   └── persisted-thinking-chain.tsx # Agent 执行元数据
└── dashboard/
    └── project-card.tsx    # 项目卡片

stores/
└── workspace-store.ts      # Zustand (activeTab, viewMode, sending/generating)

types/
└── index.ts                # TS 类型 + 枚举 (Document, Session, StreamStep, etc.)

middleware.ts               # Auth 路由保护
```

---

## 5. 数据模型

### 核心表

**sessions** — 项目会话

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| userId | uuid | FK → users |
| title | text | 项目标题 |
| description | text | 描述 |
| status | enum | active / archived / completed |
| createdAt | timestamp | |
| updatedAt | timestamp | |

**documents** — 设计产物 (append-only 版本管理)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| sessionId | uuid | FK → sessions |
| type | enum | mermaid / api_spec / arch_design / dev_plan / markdown |
| diagramType | enum | architecture / er / flow / sequence / class / other |
| title | text | |
| content | text | Mermaid 代码或 Markdown |
| version | int | 递增版本号 |
| parentVersionId | uuid | FK → documents (上一版本) |
| createdAt | timestamp | |

**messages** — 对话消息

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| sessionId | uuid | FK → sessions |
| role | enum | user / assistant / system |
| content | text | |
| metadata | jsonb | Agent 执行元数据 (steps, tools, generatedTypes) |
| createdAt | timestamp | |

**templates** — 提示词模板

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | PK |
| name | text | 模板名 |
| description | text | |
| icon | text | Lucide 图标名 |
| prompt | text | 模板提示词 |
| isBuiltin | boolean | |

---

## 6. 核心流程

### 6.1 AI 生成流程 (`POST /api/generate`)

```
用户发送 prompt
      │
      ▼
Orchestrator 分析 → 返回 Agent 列表 (如 ["design", "er", "api"])
      │
      ▼
获取该 Session 下各类型的最新文档 (作为上下文)
      │
      ▼
并行启动所有 Agent ──────────────────────────────┐
      │                                           │
      │  每个 Agent 完成时:                        │
      │  1. SSE 推送 agent_output                  │
      │  2. createDocument() 存储                  │
      │  3. SSE 推送 doc_saved                     │
      │                                           │
      ▼                                           │
全部完成 → 保存 assistant 消息 (含 metadata) ◄────┘
      │
      ▼
SSE 推送 done → 前端刷新数据
```

### 6.2 文档版本管理

- **写入**: `createDocument()` 自动查询同类型最新版本，`version += 1`，设置 `parentVersionId`
- **读取**: 前端按 `type` + `diagramType` 分组，取最高版本展示
- **原则**: 只追加不覆盖，支持版本历史追溯

### 6.3 前端文档分组逻辑

```typescript
// page.tsx — 将 documents 按 Tab 分组
for (const doc of documents) {
  const key = doc.type === "mermaid"
    ? (doc.diagramType === "er" ? "er" : "mermaid")  // 按 diagramType 拆分
    : doc.type;
  grouped[key] = highestVersion(doc);
}
```

5 个 Tab: `mermaid`(架构图) | `er`(ER图) | `arch_design`(需求分析) | `api_spec`(API规范) | `dev_plan`(发展计划)

---

## 7. 认证与鉴权

- **认证**: Auth.js v5, JWT 策略
  - Credentials: 邮箱 + 密码 (bcryptjs 哈希)
  - GitHub OAuth (可选)
- **路由保护**: `middleware.ts` 拦截 `/dashboard`, `/session`, `/profile`
- **API 鉴权**: 每个 API 路由调用 `auth()` 获取 session，校验资源归属

---

## 8. 关键设计决策

| 决策 | 原因 |
|------|------|
| 只存 Mermaid 文本，不存图片 | 可 diff、可编辑、存储成本低、渲染交前端 |
| 文档 append-only | 完整审计追踪、支持回滚、避免覆盖 |
| Agent 并行执行 | 减少用户等待时间 |
| SSE 而非 WebSocket | 单向推送足够、实现简单、无状态 |
| Mermaid 客户端渲染 | 减轻服务端压力、支持交互 (缩放/平移) |
| DeepSeek + OpenAI SDK | 兼容性好、成本低、易切换模型 |
| metadata 存 JSONB | Agent 执行细节与消息绑定、灵活扩展 |
| user.md 个人配置 | AI Agent 可读取用户偏好作为上下文 |

---

## 9. 常用命令

```bash
pnpm dev            # 开发服务器 (Turbopack)
pnpm build          # 生产构建
pnpm db:generate    # 生成 Drizzle 迁移
pnpm db:push        # 推送 schema 到数据库
pnpm db:studio      # Drizzle Studio GUI
```

---

## 10. 环境变量

```
DATABASE_URL        — Neon PostgreSQL 连接串
NEXTAUTH_SECRET     — Auth.js 签名密钥
DEEPSEEK_API_KEY    — DeepSeek API Key
GITHUB_CLIENT_ID    — GitHub OAuth (可选)
GITHUB_CLIENT_SECRET — GitHub OAuth (可选)
```

---

## 11. 项目创新点

### 11.1 基于 LLM 的多智能体动态编排
- **Orchestrator 动态路由**：由 LLM 充当调度器，根据用户需求语义智能选择 Sub-Agent 组合，而非固定流水线。如「做一个电商系统」可能触发全部 5 个 Agent，而「改一下 API 接口」仅触发 API Agent
- **并行 Agent 执行**：选定的 Agent 通过 `Promise.all()` 并行运行，各自独立完成后立即持久化结果，不阻塞其他 Agent
- **跨 Agent 上下文传递**：Agent 间通过数据库中已有文档进行上下文传递（如 Design Agent 接收现有架构图作为参考），实现迭代式增量生成而非每次从零开始

### 11.2 全局后台生成 + 实时通知
- **SSE 流式输出脱离组件生命周期**：将 SSE fetch + reader 循环从 React 组件 `useState` 提升到全局 Zustand Store，用户离开页面后生成任务不中断
- **跨页面 Toast 通知**：通过 `GenerationWatcher` 在 Layout 层监听状态变化，右下角弹窗实时通知生成进度、完成、错误，支持一键跳转查看结果
- **侧边栏状态指示**：正在生成的 Session 显示绿色脉冲圆点，用户可直观感知后台任务

### 11.3 对话式需求澄清 + [READY] 自动触发
- Conversation Agent 通过多轮对话与用户澄清需求，当判断信息充分时在回复中嵌入 `[READY]` 标记
- 客户端检测到标记后自动触发 Orchestrator → Agent 确认 → 并行生成的完整流程，实现「聊着聊着就把设计做完了」的自然交互体验

### 11.4 文档版本 Append-Only 策略
- 所有 AI 生成的文档采用追加式版本管理，每次生成创建新版本并记录 `parentVersionId`，保留完整变更历史，支持版本回溯

### 11.5 用户画像注入
- 用户可编辑个人背景信息（`user.md`），系统自动将其注入所有 Agent 的提示词，实现个性化输出（如「我是做 ToB SaaS 的」→ Agent 会倾向企业级架构）

---

## 12. 后端优化手段

### 12.1 并行数据查询
多处 API 路由使用 `Promise.all()` 并发执行数据库查询，消除串行等待：
```typescript
// /api/sessions/[id]/chat/route.ts
const [user, rawMessages] = await Promise.all([
  getUserById(session.user.id),
  getSessionMessages(id, 40),
]);
```

### 12.2 SSE 流式响应
- 使用 `ReadableStream` + `TextEncoder` 实现 Server-Sent Events
- 对话 Agent 以 `AsyncGenerator` 逐 token 推送；生成 Agent 以事件驱动（`agent_start` → `agent_output` → `doc_saved` → `done`）推送进度
- 响应头设置 `Cache-Control: no-cache`、`Connection: keep-alive` 保持长连接

### 12.3 数据库索引优化
在高频查询的外键列建立索引，查询复杂度从 O(n) 降至 O(log n)：
```
sessions_user_id_idx     → sessions.userId
documents_session_id_idx → documents.sessionId
messages_session_id_idx  → messages.sessionId
```

### 12.4 查询封装与复用
所有数据库查询封装在 `lib/db/queries/` 下，单条记录统一 `.limit(1)` 避免全表扫描，按时间/版本降序确保获取最新记录。

### 12.5 Neon Serverless 无状态连接
采用 Neon PostgreSQL 的 HTTP 无状态连接（`@neondatabase/serverless`），无需连接池预热，每次请求按需建立连接，适配 Vercel Serverless 部署场景。

### 12.6 Agent 参数精细调优

| Agent | Temperature | Max Tokens | 设计意图 |
|-------|-----------|-----------|---------|
| Orchestrator | 0.1 | 200 | 快速确定性路由，低延迟 |
| Conversation | 0.7 | 800 | 自然流畅对话 |
| Design/ER/Requirement/API/Plan | 0.3 | 3000-4000 | 结构化准确输出 |

### 12.7 输入边界控制
- 用户输入限制 10,000 字符
- 对话历史窗口限制最近 20 条消息，每条限 4,000 字符
- 防止超长输入导致 token 消耗失控和 API 超时

### 12.8 认证三重检查
所有 API 路由入口依次执行：`auth()` 身份认证 → Zod 输入校验 → 资源归属鉴权（确认 session 属于当前用户），密码使用 bcryptjs 加盐哈希。

### 12.9 容错与优雅降级
- Orchestrator 解析失败时返回默认 Agent 列表 `["requirement", "design", "api", "plan"]`
- Agent 执行采用 `Promise.allSettled` 模式，单个 Agent 失败不影响其他 Agent 继续运行
- 非关键操作（如摘要消息保存）使用 `.catch(() => {})` 静默处理，不阻断主流程

---

## 13. 前端优化手段

### 13.1 全局状态管理 — 后台生成不中断
- `generation-store.ts`：SSE reader 循环在 Zustand Store 内部以 fire-and-forget 模式运行，完全脱离 React 组件生命周期
- 支持多 Session 同时生成（`Map<sessionId, GenerationRun>`）
- 集成 `AbortController` 支持用户取消正在进行的生成

### 13.2 Mermaid 图表按需加载
- 使用 `import("mermaid")` 动态加载（约 2MB），避免首屏加载重型依赖
- `cancelled` 标志位防止组件卸载后的状态更新（内存泄漏防护）
- 基于 CSS `transform` 的平移缩放，性能优于 DOM 重排操作

### 13.3 Markdown 渲染 Memoization
- 使用 `marked.lexer()` 将 Markdown 拆分为独立 Block
- 每个 Block 使用 `React.memo()` + 自定义比较函数（仅比较 `content`），避免无关 Block 的重渲染

### 13.4 Optimistic UI
- 用户消息发送后立即以临时 ID 展示在界面上，不等待服务端确认
- 服务端保存完成后从数据库重新加载消息列表，替换临时消息

### 13.5 GSAP 面板动画
- 预览面板的展开/收起使用 GSAP 动画（`power2.out` / `power2.inOut` 缓动），同时动画化 `flex`、`width`、`opacity` 三个属性，比 CSS transition 更流畅

### 13.6 智能滚动管理
- 使用 `use-stick-to-bottom` 库实现聊天自动滚动到底部
- 当用户主动向上滚动时停止自动滚动，显示「回到底部」浮动按钮

### 13.7 Toast 通知系统
- Sonner 库集成，右下角非阻塞式通知
- 同一 Session 使用固定 `id` 避免 Toast 堆叠
- 完成通知带「查看」按钮可直接跳转到对应 Session

### 13.8 组件变体系统（CVA）
- 使用 class-variance-authority 构建 Button 等组件的多变体系统（6 种样式 × 4 种尺寸）
- 统一 focus-visible、disabled 状态样式

### 13.9 CSS 变量主题 + 自动深色模式
- 30+ CSS 自定义属性定义完整色板
- 通过 `@media (prefers-color-scheme: dark)` 实现系统级深色模式自动切换
- Tailwind v4 的 `@theme inline` 块将 CSS 变量映射为 Tailwind 工具类

### 13.10 骨架屏加载
- 侧边栏 Session 列表在加载时显示 3 个脉冲骨架占位，避免布局抖动

### 13.11 IME 输入法兼容
- 输入框 Enter 提交时检查 `e.nativeEvent.isComposing`，防止中文/日文 IME 输入法未完成时误触发提交

### 13.12 Shiki 异步语法高亮
- 代码块使用 Shiki 客户端异步高亮，支持多语言语法着色，带 fallback 降级显示
