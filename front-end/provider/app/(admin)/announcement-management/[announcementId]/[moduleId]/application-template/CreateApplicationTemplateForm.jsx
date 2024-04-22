"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { createApplicationTemplate } from "../../../actions";

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
      {pending ? "지원서 양식을 저장하는 중입니다..." : "저장하기"}
    </button>
  );
};

export default function CreateApplicationTemplateForm({
  announcementId,
  detailId,
  role,
}) {
  const router = useRouter();
  const editorRef = useRef();

  const handleApplyForm = async (applicationTemplateData) => {
    const { editorInstance } = editorRef.current;

    try {
      await createApplicationTemplate({
        announcementId,
        detailId,
        title: applicationTemplateData.get("title"),
        description: editorInstance.getMarkdown(),
        role,
      });

      router.back();
    } catch ({ message }) {
      alert(message);
    }
  };

  return (
    <form className="frame-116" action={handleApplyForm}>
      <div className="input-2">
        <label className="h5-18 color-gray-03" htmlFor="title">
          제목
        </label>
        <input
          className="frame-102-3 background-white border-gray-05 p1-18 color-gray-04"
          type="text"
          name="title"
          defaultValue=""
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
