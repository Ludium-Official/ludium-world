"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ApproveMissionCommentEditor({ missionId, usrId }) {
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
      alert("댓글을 추가하는 중 에러가 발생했습니다.");
      return;
    }

    editorInstance.setMarkdown();
    router.refresh();
  };

  return (
    <article>
      <div className="flex-end">
        <button
          type="button"
          onClick={handleCreateMissionSubmitComment}
          disabled={pending}
        >
          {pending ? "댓글을 추가하는 중입니다..." : "댓글 추가하기"}
        </button>
      </div>
      <div className="editor">
        <Editor editorRef={editorRef} content="" height="100%" />
      </div>
    </article>
  );
}
