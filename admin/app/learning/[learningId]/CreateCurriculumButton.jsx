"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import learningstyle from "../learning.module.css";

export default function CreateCurriculumButton({ learningId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCreateWorkContent = async () => {
    setPending(true);

    const createWorkContentResponse = await fetchWithRetry(
      `/learning/${learningId}`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);

    if (!createWorkContentResponse.ok) {
      switch (createWorkContentResponse.status) {
        case 403:
        case 404: {
          const { message } = await createWorkContentResponse.json();
          alert(message);
          break;
        }
        default:
          alert("커리큘럼을 추가하는 중 에러가 발생했습니다.");
      }
    }

    router.refresh();
  };

  return (
    <button
      className={learningstyle["learning-add-button"]}
      onClick={handleCreateWorkContent}
      disabled={pending}
    >
      {pending ? "커리큘럼을 추가하는 중입니다..." : "커리큘럼 추가하기"}
    </button>
  );
}
