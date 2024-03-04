"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PinContentButton({ communityId, isPinned }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handlePinContent = async () => {
    setPending(true);

    const pinContentResponse = await fetchWithRetry(
      `/content/${communityId}/pin`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);
    if (!pinContentResponse.ok) {
      alert("상단 고정하는 중 에러가 발생했습니다.");
      return;
    }

    alert("상단 고정 되었습니다.");
    router.refresh();
  };

  const handleUnpinContent = async () => {
    setPending(true);

    const unpinContentResponse = await fetchWithRetry(
      `/content/${communityId}/pin`,
      {
        method: HTTP_METHOD.DELETE,
      }
    );

    setPending(false);
    if (!unpinContentResponse.ok) {
      alert("고정 해제하는 중 에러가 발생했습니다.");
      return;
    }

    alert("고정해제 되었습니다.");
    router.refresh();
  };

  return (
    <>
      {isPinned ? (
        <>
          <button type="button" onClick={handleUnpinContent} disabled={pending}>
            {pending ? "고정 해제하는 중입니다." : "고정 해제 하기"}
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={handlePinContent} disabled={pending}>
            {pending ? "고정하는 중입니다." : "상단 고정 하기"}
          </button>
        </>
      )}
    </>
  );
}
