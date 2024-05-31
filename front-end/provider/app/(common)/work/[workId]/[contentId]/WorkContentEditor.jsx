"use client";

import { updateWorkContent } from "@/app/actions/work";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const SubmitButton = ({ isEditor }) => {
  const { pending } = useFormStatus();

  console.log({ isEditor });
  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      disabled={!isEditor ? true : pending}
    >
      {!isEditor
        ? "작업자만 저장할 수 있습니다"
        : pending
        ? "저장하는 중입니다..."
        : "저장하기"}
    </button>
  );
};

export default function WorkContentEditor({ detailContent, isEditor }) {
  const editorRef = useRef();

  const handleEditWorkContent = async (workContentForm) => {
    const { editorInstance } = editorRef.current;

    try {
      await updateWorkContent({
        detailContent,
        title: workContentForm.get("title"),
        description: editorInstance.getMarkdown(),
      });
      alert("작업물이 저장되었습니다.");
    } catch ({ message }) {
      alert(message);
    }
  };

  const handleIgnoreEnterKeyDown = (keydownEvent) => {
    if (keydownEvent.key === "Enter") keydownEvent.preventDefault();
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
          placeholder="제목을 입력해주세요"
          name="title"
          id="title"
          defaultValue={detailContent.title}
          onKeyDown={handleIgnoreEnterKeyDown}
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor
            editorRef={editorRef}
            content={detailContent.description}
            height="100%"
          />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton isEditor={isEditor} />
      </div>
    </form>
  );
}
