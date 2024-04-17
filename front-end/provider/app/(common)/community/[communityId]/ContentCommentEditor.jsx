"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ContentCommentEditor({ contentId, usrId }) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);

  const handleCreateContentComment = async () => {
    setPending(true);

    const { editorInstance } = editorRef.current;

    const createContentCommentRespnose = await fetchWithRetry(
      `/content/${contentId}/comment`,
      {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          description: editorInstance.getMarkdown(),
        }),
      }
    );
    setPending(false);

    if (!createContentCommentRespnose.ok) {
      alert("댓글을 추가하는 중 에러가 발생했습니다.");
      return;
    }

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
          onClick={handleCreateContentComment}
          disabled={usrId === null ? true : pending}
        >
          {usrId === null
            ? "로그인을 해주세요"
            : pending
            ? "댓글을 추가하는 중입니다..."
            : "댓글 추가하기"}
        </button>
      </div>
    </>
  );
}
