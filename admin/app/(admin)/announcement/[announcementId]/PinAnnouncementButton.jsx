"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PinAnnouncementButton({ announcementId, isPinned }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handlePinAnnouncement = async () => {
    setPending(true);

    const pinAnnouncementResponse = await fetchWithRetry(
      `/announcement/${announcementId}/pin`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);
    if (!pinAnnouncementResponse.ok) {
      alert("상단 고정하는 중 에러가 발생했습니다.");
      return;
    }

    alert("상단 고정 되었습니다.");
    router.refresh();
  };

  const handleUnpinAnnouncement = async () => {
    setPending(true);

    const unpinAnnouncementResponse = await fetchWithRetry(
      `/announcement/${announcementId}/pin`,
      {
        method: HTTP_METHOD.DELETE,
      }
    );

    setPending(false);
    if (!unpinAnnouncementResponse.ok) {
      alert("고정 해제하는 중 에러가 발생했습니다.");
      return;
    }

    alert("고정해제 되었습니다.");
    router.refresh();
  };

  return (
    <>
      {isPinned ? (
        <button
          type="button"
          onClick={handleUnpinAnnouncement}
          disabled={pending}
        >
          {pending ? "고정 해제하는 중입니다." : "고정 해제 하기"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePinAnnouncement}
          disabled={pending}
        >
          {pending ? "고정하는 중입니다." : "상단 고정 하기"}
        </button>
      )}
    </>
  );
}
