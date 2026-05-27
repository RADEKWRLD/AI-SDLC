import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSessionById } from "@/lib/db/queries/sessions";
import { getSessionMessages, createMessage } from "@/lib/db/queries/messages";
import { getUserById } from "@/lib/db/queries/users";
import { runConversationAgent } from "@/lib/ai/agents/conversation-agent";
import type { AgentType } from "@/lib/ai/tools";

function sseEvent(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = (body.content as string | undefined)?.trim();
  if (!content || content.length > 10000) {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const sessionData = await getSessionById(id);
  if (!sessionData || sessionData.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Save user message before calling AI
  await createMessage({ sessionId: id, role: "user", content });

  // Fetch user context and conversation history in parallel
  const [user, rawMessages] = await Promise.all([
    getUserById(session.user.id),
    getSessionMessages(id, 40),
  ]);
  const userContext = user?.userMd || undefined;
  const history = rawMessages
    .reverse()
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(data)));
      };

      let assistantText = "";
      let trigger: {
        agents: AgentType[];
        summary: string;
        reasoning: string;
      } | null = null;

      try {
        for await (const event of runConversationAgent(history, userContext)) {
          if (event.type === "token") {
            assistantText += event.text;
            send({ type: "token", token: event.text });
          } else {
            trigger = {
              agents: event.agents,
              summary: event.summary,
              reasoning: event.reasoning,
            };
            send({
              type: "trigger",
              agents: event.agents,
              summary: event.summary,
              reasoning: event.reasoning,
            });
          }
        }

        const cleanContent = assistantText.trim();

        await createMessage({
          sessionId: id,
          role: "assistant",
          content: cleanContent,
          metadata: {
            conversational: true,
            ...(trigger
              ? {
                  triggeredAgents: trigger.agents,
                  triggerReasoning: trigger.reasoning,
                  triggerSummary: trigger.summary,
                }
              : {}),
          },
        });

        send({ type: "done", trigger, content: cleanContent });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "对话失败";
        send({ type: "error", error: errorMsg });

        await createMessage({
          sessionId: id,
          role: "assistant",
          content: `抱歉，发生了错误: ${errorMsg}`,
        }).catch(() => {});
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
