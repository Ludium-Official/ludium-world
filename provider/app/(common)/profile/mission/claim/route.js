import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

export async function GET(request) {
  const cookieStore = cookies();
  const { searchParams } = new URL(request.url);
  const missionId = searchParams.get("missionId");

  const stream = new ReadableStream({
    async pull(controller) {
      const missionRewardClaimStatusResponse = await fetchWithRetry(
        `/mission-reward/status?missionId=${missionId}`,
        {
          headers: {
            Accept: "text/event-stream",
            cookie: cookieStore,
          },
        }
      );

      const reader = missionRewardClaimStatusResponse.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        controller.enqueue(encoder.encode(chunk));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
