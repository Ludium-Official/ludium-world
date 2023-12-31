"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api";

export default function ModuleCreateButton({ announceId }) {
  const router = useRouter();

  const handleCreateMake = async () => {
    await fetchWithRetry(`/announcement/${announceId}`, {
      method: "POST",
    });

    router.refresh();
  };
  return <button onClick={handleCreateMake}>세부 공고 추가하기</button>;
}
