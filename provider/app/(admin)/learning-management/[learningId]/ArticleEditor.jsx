"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateArticle } from "../actions";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "아티클을 수정하는 중입니다..." : "아티클 수정하기"}
    </button>
  );
};

export default function ArticleEditor({
  article: { title, orderNum, description, ...article },
  postingId,
}) {
  const editorRef = useRef();

  const handleEditWorkContent = async (articleData) => {
    const { editorInstance } = editorRef.current;

    try {
      const { error } = await updateArticle({
        postingId,
        title: articleData.get("title"),
        description: editorInstance.getMarkdown(),
        orderNum: articleData.get("orderNum"),
        article,
      });

      if (error) {
        alert(error);
      }
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form className="frame-116" action={handleEditWorkContent}>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="title">
          제목
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="text"
          name="title"
          id="title"
          defaultValue={title}
          placeholder="아티클 제목을 입력해주세요"
        />
      </div>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="orderNum">
          순번
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="number"
          name="orderNum"
          id="orderNum"
          defaultValue={orderNum}
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor editorRef={editorRef} content={description} height="100%" />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
