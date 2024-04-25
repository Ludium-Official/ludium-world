"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createLearning } from "../actions";

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
      {pending ? "학습을 저장하는 중입니다..." : "저장하기"}
    </button>
  );
};

export default function NewLearning() {
  const editorRef = useRef(null);

  const handleSave = async (learningData) => {
    const { editorInstance } = editorRef.current;

    try {
      await createLearning({
        title: learningData.get("title"),
        description: editorInstance.getMarkdown(),
      });
    } catch (message) {
      alert({ message });
    }
  };

  return (
    <form className="frame-116" action={handleSave}>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="title">
          제목
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor editorRef={editorRef} height="100%" />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
