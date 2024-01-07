"use client";

import Editor from "@/components/Editor";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import workstyle from "../work.module.css";

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
    <form onSubmit={handleCreateComment}>
      <div className={workstyle["content-navigation"]}>
        <button className={workstyle["work-add-button"]} disabled={pending}>
          {pending ? "댓글을 저장하는 중입니다..." : "댓글 저장"}
        </button>
      </div>
      <Editor editorRef={editorRef} content="" />
    </form>
  );
}
