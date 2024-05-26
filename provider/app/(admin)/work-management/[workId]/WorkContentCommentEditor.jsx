"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createComment } from "../actions";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="button1" type="submit" disabled={pending}>
      {pending ? "댓글을 저장하는 중입니다..." : "댓글 저장"}
    </button>
  );
};

export default function WorkContentCommentEditor({ workId, workContentId }) {
  const editorRef = useRef();

  const handleCreateComment = async () => {
    const { editorInstance } = editorRef.current;

    try {
      await createComment({
        workId,
        contentId: workContentId,
        description: editorInstance.getMarkdown(),
      });
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleCreateComment}>
      <div className="frame-102-2">
        <Editor editorRef={editorRef} content="" height="100%" />
      </div>
      <div className="frame-148">
        <SubmitButton />
      </div>
    </form>
  );
}
