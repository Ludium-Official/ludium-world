"use client";

import { CreateMissionComment } from "@/app/actions/mission";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = (usrId) => {
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
        ? "댓글을 작성하는 중입니다..."
        : "작성하기"}
    </button>
  );
};

export default function MissionSubmitCommentEditor({
  learningId,
  curriculumId,
  missionId,
  usrId,
}) {
  const editorRef = useRef();

  const handleCreateMissionSubmitComment = async () => {
    const { editorInstance } = editorRef.current;

    try {
      CreateMissionComment({
        learningId,
        curriculumId,
        missionId,
        usrId,
        description: editorInstance.getMarkdown(),
      });
      alert("댓글이 추가되었습니다.");
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form action={handleCreateMissionSubmitComment}>
      <div className="frame-102-2">
        <Editor editorRef={editorRef} content="" height="100%" />
      </div>
      <div className="frame-148">
        <SubmitButton usrId={usrId} />
      </div>
    </form>
  );
}
