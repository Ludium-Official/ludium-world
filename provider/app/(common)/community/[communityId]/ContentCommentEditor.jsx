"use client";

import { createContentComment } from "@/app/actions/content";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = ({ usrId }) => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button1"
      type="submit"
      disabled={usrId === null ? true : pending}
    >
      {usrId === null
        ? "로그인을 해주세요"
        : pending
        ? "댓글을 추가하는 중입니다..."
        : "댓글 추가하기"}
    </button>
  );
};

export default function ContentCommentEditor({ contentId, usrId }) {
  const editorRef = useRef();

  const handleCreateContentComment = async () => {
    const { editorInstance } = editorRef.current;

    try {
      await createContentComment({
        contentId,
        description: editorInstance.getMarkdown(),
      });

      alert("댓글이 추가되었습니다.");
      editorInstance.setMarkdown();
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleCreateContentComment}>
      <div className="frame-102-2">
        <Editor editorRef={editorRef} content="" height="100%" />
      </div>
      <div className="frame-148">
        <SubmitButton usrId={usrId} />
      </div>
    </form>
  );
}
