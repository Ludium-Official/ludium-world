"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "@/functions/api";

export default function ModuleDeleteButton({ moduleId }) {
  const router = useRouter();
  const handleModuleDelete = async () => {
    const deleteModuleResponse = await fetchWithRetry(`/module/${moduleId}`, {
      method: "DELETE",
    });

    if (!deleteModuleResponse.ok)
      alert("모듈을 삭제하는 중에 에러가 발생했습니다.");
    else {
      alert("모듈이 삭제되었습니다.");
      router.refresh();
    }
  };
  return <button onClick={handleModuleDelete}>삭제하기</button>;
}
