"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import WORK_STATUS from "@/enums/WORK_STATUS";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveWorkButton({ work }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const handleApproveWork = async () => {
    setPending(true);

    const approveWorkResponse = await fetchWithRetry(
      `/announcement/${work.postingId}/${work.detailId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...work,
          status: WORK_STATUS.APPROVE,
        }),
      }
    );

    setPending(false);
    if (!approveWorkResponse.ok)
      alert("작업을 승인하는 중 에러가 발생했습니다.");

    router.refresh();
  };
  return (
    <button type="button" onClick={handleApproveWork} disabled={pending}>
      {pending ? "작업을 승인하는 중입니다..." : "승인하기"}
    </button>
  );
}
