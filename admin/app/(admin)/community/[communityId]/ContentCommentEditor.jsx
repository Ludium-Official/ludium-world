"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ContentCommentEditor({ contentId }) {
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
      <div className="flex-end">
        <button
          className="button1"
          onClick={handleCreateContentComment}
          disabled={pending}
        >
          {pending ? "댓글을 추가하는 중입니다..." : "댓글 추가하기"}
        </button>
      </div>
      <div className="editor">
        <Editor editorRef={editorRef} content="" height="100%" />;
      </div>
    </>
  );
}
