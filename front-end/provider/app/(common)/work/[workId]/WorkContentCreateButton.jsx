"use client";

import Icon from "@/components/Icon";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkContentCreateButton({ workId }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleCreateWorkContent = async () => {
    setPending(true);

    const createWorkContentResponse = await fetchWithRetry(
      `/detailed-announcement/${workId}`,
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
          alert("작업물을 추가하는 중 에러가 발생했습니다.");
      }
    }

    alert("작업물을 추가했습니다.");
    router.refresh();
  };

  return (
    <div className="flex-end margin1">
      <button
        className="button-M"
        onClick={handleCreateWorkContent}
        disabled={pending}
      >
        <Icon
          src="/icon_plus_white.svg"
          alt="작업물 추가"
          width={24}
          height={24}
        />
        <p className="h5-18 color-white">
          {pending ? "추가중..." : "작업물 추가"}
        </p>
      </button>
    </div>
  );
}
