"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModuleCreateButton({ announceId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCreateDetailedAnnouncement = async () => {
    setPending(true);
    const createDetailedAnnouncementResponse = await fetchWithRetry(
      `/announcement/${announceId}`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    if (!createDetailedAnnouncementResponse.ok)
      throw new Error("작업을 만드는 중 에러가 발생했습니다.");

    setPending(false);
    router.refresh();
  };
  return (
    <button onClick={handleCreateDetailedAnnouncement} disabled={pending}>
      {pending ? "작업 추가하는 중입니다..." : "작업 추가하기"}
    </button>
  );
}
