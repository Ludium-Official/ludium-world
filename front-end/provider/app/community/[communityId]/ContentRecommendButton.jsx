"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContentRecommendButton({
  contentId,
  isContentRecommendExist,
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [contentRecommendExist, setContentRecommendExist] = useState(
    isContentRecommendExist
  );

  const recommendContent = async () => {
    setPending(true);

    const recommendContentResponse = await fetchWithRetry(
      `/content/${contentId}/recommend`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);

    if (!recommendContentResponse.ok) {
      alert("추천 중 에러가 발생했습니다.");
      return;
    }

    alert("콘텐츠를 추천했습니다.");
    setContentRecommendExist(true);
    router.refresh();
  };

  const cancelRecommendContent = async () => {
    setPending(true);

    const cancelRecommendContentResponse = await fetchWithRetry(
      `/content/${contentId}/recommend`,
      {
        method: HTTP_METHOD.DELETE,
      }
    );

    setPending(false);

    if (!cancelRecommendContentResponse.ok) {
      alert("추천 해제 중 에러가 발생했습니다.");
      return;
    }

    alert("콘텐츠를 추천 해제했습니다.");
    setContentRecommendExist(false);
    router.refresh();
  };

  return (
    <div>
      {contentRecommendExist ? (
        <button
          className="button2 caption-12"
          type="button"
          onClick={cancelRecommendContent}
          disabled={pending}
        >
          {pending ? "해제중.." : "추천 해제"}
        </button>
      ) : (
        <button
          className="button2 caption-12"
          type="button"
          onClick={recommendContent}
          disabled={pending}
        >
          {pending ? "추천중.." : "추천"}
        </button>
      )}
    </div>
  );
}
