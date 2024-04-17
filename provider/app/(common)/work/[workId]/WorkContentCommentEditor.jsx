"use client";

import Editor from "@/components/Editor";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function WorkContentCommentEditor({ workId, workContentId }) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    setPending(true);
    const { editorInstance } = editorRef.current;

    const createCommentResponse = await fetchWithRetry(
      `/detailed-announcement/${workId}/${workContentId}`,
      {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    setPending(false);
    if (!createCommentResponse.ok) {
      alert("댓글을 저장하는 중 에러가 발생했습니다.");
    } else {
      editorInstance.setMarkdown();
      router.refresh();
    }
  };

  return (
    <>
      <div className="frame-102-2">
        <Editor editorRef={editorRef} content="" height="100%" />
      </div>
      <div className="frame-148">
        <button
          className="button1"
          onClick={handleCreateComment}
          disabled={pending}
        >
          {pending ? "댓글을 작성하는 중입니다..." : "작성하기"}
        </button>
      </div>
    </>
  );
}
