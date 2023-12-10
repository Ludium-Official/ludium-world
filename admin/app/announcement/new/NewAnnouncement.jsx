"use client";

import { useRef, useState } from "react";
import Editor from "../../../components/Editor";
import fetchWithRetry from "../../../functions/api";
import { useRouter } from "next/navigation";
import announcementstyle from "../announcement.module.css";

export default function NewAnnouncement() {
  const editorRef = useRef(null);
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();

    const { editorInstance } = editorRef.current;
    const formData = new FormData(e.target);
    formData.append("content", editorInstance.getMarkdown());

    const createAnnouncementResponse = await fetchWithRetry(`/announcement`, {
      method: "POST",
      body: formData,
    });

    if (createAnnouncementResponse.ok) {
      router.push("/announcement");
      router.refresh();
    }
  };

  const handleBack = () => {
    router.push("/announcement");
  };

  return (
    <form className={announcementstyle["form-wrapper"]} onSubmit={handleSave}>
      <div className={announcementstyle["form-button-area"]}>
        <button
          className={announcementstyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={announcementstyle["form-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={announcementstyle["form-header"]}>
        <input
          className={announcementstyle["form-title"]}
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
        />
      </div>
      <div className={announcementstyle["form-content-area"]}>
        <Editor editorRef={editorRef} height="100%" />
      </div>
    </form>
  );
}
