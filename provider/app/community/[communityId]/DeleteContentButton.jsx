"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteContentButton({ communityId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDeleteContent = async () => {
    const isDelete = confirm("콘텐츠를 삭제하시겠습니까?");

    if (!isDelete) return;

    setPending(true);

    const deleteContentResponse = await fetchWithRetry(
      `/content/${communityId}`,
      {
        method: HTTP_METHOD.DELETE,
      }
    );

    setPending(false);
    if (!deleteContentResponse.ok) {
      alert("콘텐츠를 삭제하는 중 에러가 발생했습니다.");
      return;
    }

    alert("콘텐츠가 삭제되었습니다.");
    router.back();
    router.refresh();
  };

  return (
    <div>
      <button
        className="button2 caption-12"
        type="button"
        onClick={handleDeleteContent}
        disabled={pending}
      >
        {pending ? "콘텐츠를 삭제하는 중입니다..." : "삭제하기"}
      </button>
    </div>
  );
}
