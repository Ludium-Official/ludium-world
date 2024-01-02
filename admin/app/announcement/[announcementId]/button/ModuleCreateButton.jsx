"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "@/functions/api";
import { useState } from "react";

export default function ModuleCreateButton({ announceId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCreateMake = async () => {
    setPending(true);
    const createDetailedAnnouncementResponse = await fetchWithRetry(
      `/announcement/${announceId}`,
      {
        method: "POST",
      }
    );

    if (!createDetailedAnnouncementResponse.ok)
      throw new Error("세부 공고를 만드는 중 에러가 발생했습니다.");

    setPending(false);
    router.refresh();
  };
  return (
    <button onClick={handleCreateMake} disabled={pending}>
      {pending ? "세부 공고 추가하는 중입니다..." : "세부 공고 추가하기"}
    </button>
  );
}
