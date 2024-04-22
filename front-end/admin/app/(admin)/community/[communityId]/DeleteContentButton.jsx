"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteContentButton({ communityId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDeleteContent = async () => {
    setPending(true);

    const deleteContentResponse = await fetchWithRetry(
      `/content/${communityId}`,
      {
        method: HTTP_METHOD.DELETE,
      }
    );

    setPending(false);
    if (!deleteContentResponse.ok) {
      alert("콘텐츠를 삭제하는 중 에러가 발생했습니다.");
      return;
    }

    router.back();
    router.refresh();
  };

  return (
    <button type="button" onClick={handleDeleteContent} disabled={pending}>
      {pending ? "콘텐츠를 삭제하는 중입니다..." : "삭제하기"}
    </button>
  );
}
