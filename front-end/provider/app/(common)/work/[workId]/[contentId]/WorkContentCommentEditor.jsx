"use client";

import { createWorkContentComment } from "@/app/actions/work";
import Editor from "@/components/Editor";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="button1" disabled={pending}>
      {pending ? "댓글을 작성하는 중입니다..." : "작성하기"}
    </button>
  );
};

export default function WorkContentCommentEditor({ workId, workContentId }) {
  const editorRef = useRef();

  const handleCreateComment = async () => {
    const { editorInstance } = editorRef.current;

    try {
      createWorkContentComment({
        workId,
        workContentId,
        description: editorInstance.getMarkdown(),
      });
      editorInstance.setMarkdown();
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
