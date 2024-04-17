"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import learningstyle from "../learning.module.css";

export default function CreateArticleButton({ learningId, curriculumId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCreateArticle = async () => {
    setPending(true);

    const createArticleResponse = await fetchWithRetry(
      `/learning/${learningId}/${curriculumId}/article`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);

    if (!createArticleResponse.ok) {
      switch (createArticleResponse.status) {
        case 403:
        case 404: {
          const { message } = await createArticleResponse.json();
          alert(message);
          break;
        }
        default:
          alert("아티클을 추가하는 중 에러가 발생했습니다.");
      }
    }

    router.refresh();
  };

  return (
    <button
      className={learningstyle["learning-add-button"]}
      onClick={handleCreateArticle}
      disabled={pending}
    >
      {pending ? "아티클을 추가하는 중입니다..." : "아티클 추가하기"}
    </button>
  );
}
