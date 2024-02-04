"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function MissionSubmitCommentEditor({ missionId, usrId }) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);

  const handleCreateMissionSubmitComment = async () => {
    setPending(true);

    const { editorInstance } = editorRef.current;

    const createMissionSubmitCommentResponse = await fetchWithRetry(
      `/mission/${missionId}/submit/${usrId}/comment`,
      {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    setPending(false);
    if (!createMissionSubmitCommentResponse.ok) {
      alert("댓글을 작성하는 중 에러가 발생했습니다.");
      return;
    }

    alert("댓글이 추가되었습니다.");
    editorInstance.setMarkdown();
    router.refresh();
  };

  return (
    <>
      <div className="frame-102-2">
        <Editor editorRef={editorRef} content="" height="100%" />
      </div>
      <div className="frame-148">
        <button
          className="button1"
          onClick={handleCreateMissionSubmitComment}
          disabled={usrId === null ? true : pending}
        >
          {pending ? "댓글을 작성하는 중입니다..." : "작성하기"}
        </button>
      </div>
    </>
  );
}
