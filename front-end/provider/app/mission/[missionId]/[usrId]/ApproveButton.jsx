"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveButton({ missionId, usrId, isApproved }) {
  const router = useRouter();
  const [pending, setPending] = useState(isApproved);

  const handleApprove = async () => {
    setPending(true);
    const approveResponse = await fetchWithRetry(
      `/mission/${missionId}/submit/${usrId}`,
      {
        method: HTTP_METHOD.PUT,
      }
    );

    if (!approveResponse.ok) {
      setPending(false);
      alert("미션을 승인하는 중 에러가 발생했습니다.");
      return;
    }
    router.refresh();
  };

  return (
    <button
      className="button1 h5-18 button-L"
      type="button"
      disabled={pending}
      onClick={handleApprove}
    >
      {isApproved
        ? "이미 승인되었습니다."
        : pending
        ? "승인하는 중입니다..."
        : "승인하기"}
    </button>
  );
}
