"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import learningstyle from "../learning.module.css";

export default function CreateMissionButton({ learningId, curriculumId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCreateMission = async () => {
    setPending(true);

    const createMissionResponse = await fetchWithRetry(
      `/learning/${learningId}/${curriculumId}/mission`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);

    if (!createMissionResponse.ok) {
      switch (createMissionResponse.status) {
        case 403:
        case 404: {
          const { message } = await createMissionResponse.json();
          alert(message);
          break;
        }
        default:
          alert("미션을 추가하는 중 에러가 발생했습니다.");
      }
    }

    router.refresh();
  };

  return (
    <button
      className={learningstyle["learning-add-button"]}
      onClick={handleCreateMission}
      disabled={pending}
    >
      {pending ? "미션을 추가하는 중입니다..." : "미션 추가하기"}
    </button>
  );
}
