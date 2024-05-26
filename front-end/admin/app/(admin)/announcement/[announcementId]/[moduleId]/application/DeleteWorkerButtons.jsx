"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";

export default function DeleteWorkerButton({ announcementId, worker }) {
  const router = useRouter();
  const deleteWorker = async () => {
    const deleteWorkerResponse = await fetchWithRetry(
      `/announcement/${announcementId}/${worker.detailId}/worker/${worker.usrId}/${worker.role}`,
      {
        method: HTTP_METHOD.DELETE,
      }
    );

    if (!deleteWorkerResponse.ok) {
      alert("작업자 권한을 해제하는 중 에러가 발생했습니다.");
      return;
    }

    alert("작업자 권한을 해제했습니다");
    router.refresh();
  };

  return (
    <button type="button" onClick={deleteWorker}>
      할당 해제
    </button>
  );
}
