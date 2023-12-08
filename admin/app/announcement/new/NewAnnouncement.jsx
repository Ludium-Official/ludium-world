"use client";

import { useRef, useState } from "react";
import Editor from "../../../components/Editor";
import fetchWithRetry from "../../../functions/api";
import { useRouter } from "next/navigation";
import announcementstyle from "../announcement.module.css";

export default function NewAnnouncement() {
  const editorRef = useRef(null);
  const [modules, setModules] = useState([]);
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();

    const { editorInstance } = editorRef.current;
    const moduleFields = e.target.querySelectorAll(`[name^="module-"]`);

    const modules = Array.from(moduleFields).reduce(
      (acc, moduleField, index) => {
        const value = moduleField.value;

        if (index === 0) {
          return `${value}`;
        }

        return `${acc}|${value}`;
      },
      ""
    );

    const formData = new FormData();

    formData.append("title", e.target.title.value);
    formData.append("content", editorInstance.getMarkdown());
    formData.append("modules", modules);

    const createAnnouncementResponse = await fetchWithRetry(`/announcement`, {
      method: "POST",
      body: formData,
    });

    if (createAnnouncementResponse.ok) {
      router.push("/announcement");
      router.refresh();
    }
  };

  const handleCreateModule = () => {
    setModules([...modules, { title: "" }]);
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
      <div className={`${announcementstyle["form-button-area"]} ${announcementstyle["form-list-add-button-area"]}`}>
        <button
          className={announcementstyle["form-button"]}
          type="button"
          onClick={handleCreateModule}
        >
          모듈 추가하기
        </button>
      </div>
      <div className={announcementstyle["form-list-area"]}>
        <div className={announcementstyle["form-list-inner"]}>
          {modules.map((_, index) => (
            <input
              className={announcementstyle["form-textfield"]}
              key={crypto.randomUUID()}
              type="text"
              name={`module-${index}`}
              id={`module-${index}`}
              placeholder="모듈 제목을 입력해주세요"
            />
          ))}
        </div>
      </div>
      <div className={announcementstyle["form-content-area"]}>
        <Editor editorRef={editorRef} height="100%" />
      </div>
    </form>
  );
}
