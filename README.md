<p align="center">
  <img src="public/logo.svg" width="80" alt="CycleMind Logo" />
</p>

<h1 align="center">CycleMind</h1>

<p align="center">
  <strong>用一句话需求，生成整套设计文档</strong><br/>
  告诉 AI 你想做什么，自动帮你画架构图、ER 图、写 API 文档和开发计划。不用手动画图，不用写模板。
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#how-it-works">How It Works</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#api-reference">API Reference</a>
</p>

---

## Features

**5 specialized AI Agents** work in parallel to generate your design artifacts:

| Agent | Output | Format |
|-------|--------|--------|
| Requirement | Structured requirement analysis | Markdown |
| Design | System architecture diagram | Mermaid |
| ER | Entity-relationship diagram | Mermaid |
| API | RESTful API specification | Markdown |
| Plan | Development roadmap & milestones | Markdown |

- **Multi-Agent Orchestration** — An orchestrator analyzes your prompt and dispatches the right agents in parallel. Results stream back in real-time via SSE.
- **Interactive Mermaid Rendering** — Architecture and ER diagrams render as interactive vector graphics with zoom, pan, and SVG export.
- **Template Library** — Pre-built project templates for web apps, mobile, microservices, and more. One click to generate a full design doc set.
- **Version Tracking** — Append-only document versioning. Every iteration creates a new version — nothing is ever overwritten.
- **Real-time Streaming** — Server-Sent Events push agent progress to the UI as it happens. No waiting for all agents to finish.

## How It Works

```
1. Describe → Write your system requirements in natural language
2. Analyze  → Orchestrator parses the prompt and selects agents
3. Generate → Multiple agents process in parallel
4. Preview  → 5 document types render instantly in tabbed panels
5. Iterate  → Append new requirements to evolve your design
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + GSAP |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | Auth.js v5 (Credentials + GitHub OAuth) |
| AI | DeepSeek API (OpenAI SDK compatible) |
| State | Zustand |
| Diagrams | Mermaid.js (client-side rendering) |
| Deploy | Vercel |

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in:
#   DATABASE_URL        — Neon PostgreSQL connection string
#   NEXTAUTH_SECRET     — Auth.js signing secret
#   DEEPSEEK_API_KEY    — DeepSeek API key
#   GITHUB_CLIENT_ID    — GitHub OAuth (optional)
#   GITHUB_CLIENT_SECRET

# 3. Push database schema
pnpm db:push

# 4. Start dev server
pnpm dev
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio GUI |

## Project Structure

```
app/                → Pages & API routes
lib/
  ├── ai/agents/    → Multi-agent system (orchestrator + 5 sub-agents)
  ├── auth/         → Auth.js configuration
  ├── db/           → Drizzle schema, queries
  └── validations   → Zod schemas
components/
  ├── ui/           → shadcn/ui base components
  ├── layout/       → Sidebar, header
  └── workspace/    → Chat panel, Mermaid renderer, preview tabs
stores/             → Zustand stores
types/              → TypeScript type definitions
```

## API Reference

All endpoints (except register) require authentication.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | User registration |
| GET/POST | `/api/auth/[...nextauth]` | Auth.js authentication |
| GET/PATCH | `/api/user` | User profile |
| GET/POST | `/api/sessions` | List / create sessions |
| GET/PATCH/DELETE | `/api/sessions/[id]` | Session CRUD |
| GET/POST | `/api/sessions/[id]/messages` | Messages |
| GET/POST | `/api/sessions/[id]/documents` | Documents |
| GET | `/api/templates` | Template library |
| POST | `/api/generate` | AI multi-agent generation (SSE stream) |

## License

MIT

---

<p align="center">
  Built by <a href="https://github.com/RADEKWRLD">RADEKWRLD</a>
</p>
