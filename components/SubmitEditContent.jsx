"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import fetchWithRetry from "../functions/api";
import Editor from "./Editor";
import missionstyle from "../app/mission/mission.module.css";

export default function SubmitEditContent({ missionId, submitId, content }) {
  const router = useRouter();
  const editorRef = useRef(null);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("content", editorRef.current.editorInstance.getMarkdown());

    const editSubmitResponse = await fetchWithRetry(
      `/mission/${missionId}/submit/${submitId}/edit`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (editSubmitResponse.ok) {
      router.push(`/mission/${missionId}/submit`, undefined, { shallow: true });
      router.refresh();
    }
  };

  const handleBack = () => {
    router.push(`/mission/${missionId}/submit`);
  }

  return (
    <form className={missionstyle["form-wrapper"]} onSubmit={handleEditSubmit}>
      <div className={missionstyle["form-button-area"]}>
      <button
          className={missionstyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={missionstyle["form-button"]}
          type="submit"
          value="수정하기"
        />
      </div>
      <div className={`${missionstyle["form-content-area"]} ${missionstyle["mission-submit-content-area"]}`}>
        <Editor editorRef={editorRef} content={content} height={"100%"} />
      </div>
    </form>
  );
}
