"use client";

import { useRef, useState } from "react";
import Editor from "../../../components/Editor";
import fetchWithRetry from "../../../functions/api";
import { useRouter } from "next/navigation";
import coursestyle from "../course.module.css";

export default function NewCourse() {
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

    const createCourseResponse = await fetchWithRetry(`/course`, {
      method: "POST",
      body: formData,
    });

    if (createCourseResponse.ok) {
      router.push("/course");
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
        />
      </div>
      {/* <div className={`${coursestyle["form-button-area"]} ${coursestyle["form-list-add-button-area"]}`}>
        <button
          className={coursestyle["form-button"]}
          type="button"
          onClick={handleCreateModule}
        >
          모듈 추가하기
        </button>
      </div> */}
      {/* <div className={coursestyle["form-list-area"]}>
        <div className={coursestyle["form-list-inner"]}>
          {modules.map((_, index) => (
            <input
              className={coursestyle["form-textfield"]}
              key={crypto.randomUUID()}
              type="text"
              name={`module-${index}`}
              id={`module-${index}`}
              placeholder="모듈 제목을 입력해주세요"
            />
          ))}
        </div>
      </div> */}
      <div className={coursestyle["form-content-area"]}>
        <Editor editorRef={editorRef} height="100%" />
      </div>
    </form>
  );
}
