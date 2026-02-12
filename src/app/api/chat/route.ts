import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/categories";
import { CategoryType } from "@/types";

export async function POST(req: Request) {
  const { messages, category } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    category: CategoryType;
  };

  const apiKey = process.env.NEAR_AI_API_KEY;
  const model = process.env.NEAR_AI_MODEL || "deepseek-ai/DeepSeek-V3.1";

  if (!apiKey) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const msg =
          "⚠️ **NEAR AI API key not configured.**\n\nTo start using UNDOX:\n\n1. Get your API key at [cloud.near.ai](https://cloud.near.ai)\n2. Create a `.env.local` file in the project root\n3. Add: `NEAR_AI_API_KEY=your_key_here`\n4. Restart the dev server\n\nYour conversations are stored locally in your browser and will be waiting for you.";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: msg })}\n\n`),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
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
