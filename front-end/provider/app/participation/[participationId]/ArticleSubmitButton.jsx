"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ArticleSubmitbutton({
  learningId,
  curriculumId,
  articleId,
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleArticleSubmit = async () => {
    setPending(true);
    const submitArticleResponse = await fetchWithRetry(
      `/learning/${learningId}/${curriculumId}/article/${articleId}`,
      {
        method: HTTP_METHOD.POST,
      }
    );

    setPending(false);
    if (!submitArticleResponse.ok)
      if (submitArticleResponse.status !== 409)
        alert("아티클을 제출하는 중 에러가 발생했습니다.");

    router.refresh();
  };
  return (
    <button
      className="button1 button-large"
      type="button"
      onClick={handleArticleSubmit}
      disabled={pending}
    >
      {pending ? "아티클을 제출하는 중입니다..." : "아티클 제출하기"}
    </button>
  );
}
