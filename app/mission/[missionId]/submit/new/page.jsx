"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Editor from "../../../../../components/Editor";
import fetchWithRetry from "../../../../../functions/api";
import { revalidatePath } from "next/cache";
import missionstyle from "../../../mission.module.css";

export default function NewMissionSubmitPage({ params }) {
  const { missionId } = params;
  const router = useRouter();
  const editorRef = useRef(null);

  const handleSaveSubmitMission = async (e) => {
    e.preventDefault();

    const { editorInstance } = editorRef.current;
    const formData = new FormData();

    formData.append("content", editorInstance.getMarkdown());
    const newMissionSubmitResponse = await fetchWithRetry(
      `/mission/${missionId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (newMissionSubmitResponse.ok) {
      router.push(`/mission/${missionId}`);
      router.refresh();
    }
  };

  return (
    <form
      className={missionstyle["form-wrapper"]}
      onSubmit={handleSaveSubmitMission}
    >
      <div className={missionstyle["form-button-area"]}>
        <input
          className={missionstyle["form-button"]}
          type="submit"
          value="제출하기"
        />
      </div>
      <div className={`${missionstyle["form-content-area"]} ${missionstyle["mission-submit-content-area"]}`}>
        <Editor editorRef={editorRef} height={"100%"} />
      </div>
    </form>
  );
}
