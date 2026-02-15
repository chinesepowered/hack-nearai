import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/categories";
import { CategoryType } from "@/types";

export async function POST(req: Request) {
  const { messages, category, apiKey: clientKey } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    category: CategoryType;
    apiKey?: string;
  };

  // Use client-provided key first, then fall back to server env var
  const apiKey = clientKey || process.env.NEAR_AI_API_KEY;
  const model = process.env.NEAR_AI_MODEL || "zai-org/GLM-4.7";

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "NO_API_KEY" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const client = new OpenAI({
    baseURL: "https://cloud-api.near.ai/v1",
    apiKey,
  });

  const systemPrompt = getSystemPrompt(category);

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ content })}\n\n`,
                ),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
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
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to process request";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
