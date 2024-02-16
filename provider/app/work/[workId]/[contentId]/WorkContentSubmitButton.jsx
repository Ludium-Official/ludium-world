"use client";

import Icon from "@/components/Icon";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import WORK_CONTENT_STATUS from "@/enums/WORK_CONTENT_STATUS";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkContentSubmitButton({ detailContent }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSubmitWorkContent = async () => {
    router.refresh();

    setPending(true);
    const submitWorkContentResponse = await fetchWithRetry(
      `/detailed-announcement/${detailContent.detailId}/${detailContent.detailContentId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...detailContent,
          status: WORK_CONTENT_STATUS.SUBMIT,
        }),
      }
    );

    setPending(false);
    if (!submitWorkContentResponse.ok) {
      switch (submitWorkContentResponse.status) {
        case 403:
        case 404: {
          const { message } = await submitWorkContentResponse.json();
          alert(message);
          break;
        }
        default:
          alert("작업물을 제출하는 중에 에러가 발생했습니다.");
      }
    } else {
      alert("작업물이 제출되었습니다.");
      router.refresh();
    }
  };

  return (
    <button
      className="frame-56 background-white border-none"
      type="button"
      onClick={handleSubmitWorkContent}
      disabled={pending}
    >
      <Icon
        src="/icon_flag_purple01.svg"
        alt="제출하기"
        width={24}
        height={24}
      />
      <p className="h4-20 color-purple-01">
        {pending ? "제출중..." : "제출하기"}
      </p>
    </button>
  );
}
