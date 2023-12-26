"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import "tui-grid/dist/tui-grid.css";
import Editor from "../../../../../../../../components/Editor";
import fetchWithRetry from "../../../../../../../../functions/api";
import announcementstyle from "../../../../../../announcement.module.css";
import Category from "../../../../../../../../enums/Category";

export default function EditMakeContent({
  module,
  announcementId,
  moduleId,
  makeId
}) {
  const editorRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { editorInstance } = editorRef.current;

    formData.append("content", editorInstance.getMarkdown());

    const editModuleResponse = await fetchWithRetry(
      `/announcement/${moduleId}/module/${makeId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (editModuleResponse.ok) {
      router.push(`/announcement/${announcementId}/module/${moduleId}`);
      router.refresh();
    }
  };

  const handleBack = () => {
    router.back();
  }

  return (
    <form className={`${announcementstyle["announcement-edit-wrapper"]} ${announcementstyle["form-wrapper"]}`} onSubmit={handleSubmit}>
      <div className={announcementstyle["announcement-edit-button-area"]}>
        <button className={announcementstyle["announcement-edit-button"]} type="button" onClick={handleBack}>돌아가기</button>
        <input
          className={announcementstyle["announcement-edit-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={announcementstyle["announcement-edit-header-area"]}>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={module.title}
          placeholder="제목을 입력해주세요"
        />
      </div>
      <select name="category" id="category">
        <option value={Category.MISSION}>미션</option>
        <option value={Category.ARTICLE}>아티클</option>
      </select>
      <div className={announcementstyle["announcement-edit-content-area"]}>
        <Editor editorRef={editorRef} content={module.content} height={"100%"} />
      </div>
    </form>
  );
}
