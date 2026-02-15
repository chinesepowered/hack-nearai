export async function GET() {
  return Response.json({
    hasServerKey: !!process.env.NEAR_AI_API_KEY,
    defaultModel: process.env.NEAR_AI_MODEL || "zai-org/GLM-4.7",
  });
}
