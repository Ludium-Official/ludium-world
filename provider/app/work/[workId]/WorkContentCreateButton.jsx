"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkContentCreateButton({ workId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCreateWorkContent = async () => {
    setPending(true);

    const createWorkContentResponse = await fetchWithRetry(
      `/detailed-announcement/${workId}`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);
    if (!createWorkContentResponse.onClick)
      throw new Error("작업물을 추가하는 중 에러가 발생했습니다.");

    router.refresh();
  };

  return (
    <button onClick={handleCreateWorkContent} disabled={pending}>
      {pending ? "작업물을 추가하는 중입니다..." : "작업물 추가하기"}
    </button>
  );
}
