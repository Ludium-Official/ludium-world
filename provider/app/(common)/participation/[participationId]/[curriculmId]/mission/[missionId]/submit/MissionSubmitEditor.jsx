"use client";

import { MissionSubmit } from "@/app/actions/mission";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button className="button1 h5-18 button-L" type="submit" disabled={pending}>
      {pending ? "제출하는 중입니다..." : "제출하기"}
    </button>
  );
};

export default function MissionSubmitEditor({
  learningId,
  curriculumId,
  missionId,
  missionSubmit,
  isCreate,
}) {
  const editorRef = useRef();
  const description = isCreate
    ? missionSubmit.missionSubmitForm
    : missionSubmit.description;

  const getMissionSubmitRequest = () => {
    const body = isCreate
      ? JSON.stringify({
          description: editorRef.current.editorInstance.getMarkdown(),
        })
      : JSON.stringify({
          ...missionSubmit,
          description: editorRef.current.editorInstance.getMarkdown(),
        });

    const method = isCreate ? HTTP_METHOD.POST : HTTP_METHOD.PUT;

    return Promise.resolve(
      MissionSubmit({
        learningId,
        curriculumId,
        missionId,
        method,
        body,
      })
    );
  };

  const handleMissionSubmit = async () => {
    try {
      await getMissionSubmitRequest();
      alert("미션이 제출되었습니다.");
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form
      className="frame background-white border-gray-06"
      action={handleMissionSubmit}
    >
      <div className="frame-101">
        <div className="frame-9">
          <h1 className="h4-20 color-black">제출 내용</h1>
        </div>
      </div>
      <section className="frame-101 mission-submit-content">
        <Editor editorRef={editorRef} content={description} height="100%" />
      </section>
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
