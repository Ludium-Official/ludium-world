import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

export async function GET(request) {
  const cookieStore = cookies();
  const { searchParams } = new URL(request.url);
  const resourceId = searchParams.get("resourceId");

  const stream = new ReadableStream({
    async pull(controller) {
      const rewardClaimStatusResponse = await fetchWithRetry(
        `/reward/status?resourceId=${resourceId}`,
        {
          headers: {
            Accept: "text/event-stream",
            cookie: cookieStore,
          },
        }
      );

      const reader = rewardClaimStatusResponse.body.getReader();
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
