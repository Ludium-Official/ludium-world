"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const { default: dynamic } = require("next/dynamic");

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function MissionSubmitEditor({
  learningId,
  curriculumId,
  missionId,
  missionSubmit,
  isCreate,
}) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);
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
      fetchWithRetry(
        `/learning/${learningId}/${curriculumId}/mission/${missionId}`,
        {
          method,
          body,
        }
      )
    );
  };

  const handleMissionSubmit = async () => {
    setPending(true);
    const missionSubmitResponse = await getMissionSubmitRequest();

    setPending(false);
    if (!missionSubmitResponse.ok) {
      alert("미션을 제출하는 중 에러가 발생했습니다.");
    }

    router.refresh();
  };

  return (
    <>
      <section className="frame-101 mission-content">
        <Editor editorRef={editorRef} content={description} height="100%" />
      </section>
      <div className="frame-157">
        <button
          className="button1 h5-18 button-L"
          type="button"
          disabled={pending}
          onClick={handleMissionSubmit}
        >
          {pending ? "제출하는 중입니다..." : "제출하기"}
        </button>
      </div>
    </>
  );
}
