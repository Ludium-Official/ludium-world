"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Editor from "../../../components/Editor";
import Category from "../../../enums/Category";
import fetchWithRetry from "../../../functions/api";
import missionstyle from "../mission.module.css";

export default function NewMissionPage() {
  const router = useRouter();
  const editorRef = useRef(null);

  const handleSaveMission = async (e) => {
    e.preventDefault();

    const { editorInstance } = editorRef.current;
    const formData = new FormData(e.target);

    formData.append("content", editorInstance.getMarkdown());

    const createMissionResponse = await fetchWithRetry(`/article`, {
      method: "POST",
      body: formData,
    });

    if (createMissionResponse.ok) {
      router.push("/mission");
      router.refresh();
    }
  };

  const handleBack = () => {
    router.push("/mission");
  }

  return (
    <form
      className={missionstyle["mission-new-wrapper"]}
      onSubmit={handleSaveMission}
    >
      <div className={missionstyle["form-button-area"]}>
        <button
          className={missionstyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={missionstyle["mission-new-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={missionstyle["mission-new-header-area"]}>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
        />
        <select name="category" id="category">
          <option value={Category.MISSION}>미션</option>
          <option value={Category.ARTICLE}>아티클</option>
        </select>
      </div>
      <div className={missionstyle["mission-new-content-area"]}>
        <Editor editorRef={editorRef} height={"100%"} />
      </div>
    </form>
  );
}
