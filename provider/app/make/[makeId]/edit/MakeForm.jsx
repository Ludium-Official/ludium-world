"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Editor from "../../../../components/Editor";
import Category from "../../../../enums/Category";
import fetchWithRetry from "../../../../functions/api";
import makestyle from "../../make.module.css";

export default function MakeForm({ id, title, content, shareable }) {
  const router = useRouter();
  const editorRef = useRef(null);

  const handleSavemake = async (e) => {
    e.preventDefault();

    const { editorInstance } = editorRef.current;
    const formData = new FormData(e.target);

    formData.append("content", editorInstance.getMarkdown());

    const createmakeResponse = await fetchWithRetry(`/make/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!createmakeResponse.ok) {
      switch (createmakeResponse.status) {
        case 403:
          alert((await createmakeResponse.json()).message);
          break;
        default:
          console.error(createmakeResponse.status);
          break;
      }
      return;
    }

    router.push(`/make/${id}`);
    router.refresh();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <form className={makestyle["make-new-wrapper"]} onSubmit={handleSavemake}>
      <div className={makestyle["form-button-area"]}>
        <button
          className={makestyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        {shareable ? (
          <button className={makestyle["form-button"]} type="button">
            공유하기
          </button>
        ) : null}
        <input
          className={makestyle["form-button"]}
          type="submit"
          value="저장하기"
        />
      </div>
      <div className={makestyle["make-new-header-area"]}>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
          defaultValue={title}
          readOnly
        />
        <select
          name="category"
          id="category"
          defaultValue={Category.MAKE}
          readOnly
        >
          <option value={Category.MAKE}>제작</option>
        </select>
      </div>
      <div className={makestyle["make-new-content-area"]}>
        <Editor editorRef={editorRef} content={content} height={"100%"} />
      </div>
    </form>
  );
}
