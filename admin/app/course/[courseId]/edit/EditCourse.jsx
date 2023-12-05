"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Editor from "../../../../components/Editor";
import fetchWithRetry from "../../../../functions/api";
import coursestyle from "../../course.module.css";

export default function EditCourse({id, title, content}) {
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

    const createCourseResponse = await fetchWithRetry(`/course/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (createCourseResponse.ok) {
      router.push(`/course/${id}`);
      router.refresh();
    }
  };

  const handleCreateModule = () => {
    setModules([...modules, { title: "" }]);
  };

  const handleBack = () => {
    router.push("/course");
  };

  return (
    <form className={coursestyle["form-wrapper"]} onSubmit={handleSave}>
      <div className={coursestyle["form-button-area"]}>
        <button
          className={coursestyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={coursestyle["form-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={coursestyle["form-header"]}>
        <input
          className={coursestyle["form-title"]}
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
          defaultValue={title}
        />
      </div>
      <div className={coursestyle["form-content-area"]}>
        <Editor editorRef={editorRef} content={content} height="100%" />
      </div>
    </form>
  );
}
