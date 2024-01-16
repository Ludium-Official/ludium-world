"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveMissionSubmitButton({
  missionId,
  usrId,
  isApproved,
}) {
  const router = useRouter();
  const [pending, setPending] = useState(isApproved);

  const handleApproveMissionSubmit = async () => {
    setPending(true);

    const approveMissionSubmitResponse = await fetchWithRetry(
      `/mission/${missionId}/submit/${usrId}`,
      {
        method: HTTP_METHOD.PUT,
      }
    );

    if (approveMissionSubmitResponse.ok) {
      router.refresh();
      return;
    }

    setPending(false);
    alert("미션 제출을 승인하는 중 에러가 발생했습니다.");
  };
  return (
    <button
      type="button"
      onClick={handleApproveMissionSubmit}
      disabled={isApproved || pending}
    >
      {isApproved
        ? "미션 제출이 이미 승인되었습니다."
        : pending
        ? "미션 제출을 승인하는 중입니다..."
        : "승인하기"}
    </button>
  );
}
