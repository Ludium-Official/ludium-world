"use client";

import { updateAnnouncementApplication } from "@/app/actions/announcement";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="button-L-2 background-purple-01 h5-18 color-white"
      type="submit"
      disabled={pending}
    >
      {pending ? "지원서를 제출하는 중입니다..." : "제출하기"}
    </button>
  );
};

export default function EditApplyForm({
  announcementId,
  detailId,
  application,
}) {
  const editorRef = useRef();

  const handleApplyForm = async () => {
    const { editorInstance } = editorRef.current;

    try {
      updateAnnouncementApplication({
        announcementId,
        detailId,
        application,
        description: editorInstance.getMarkdown(),
      });
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
          id="title"
          defaultValue={application.title}
          readOnly
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor
            editorRef={editorRef}
            height="100%"
            content={application.description}
          />
        </div>
      </div>
      <div className="frame-157">
        <SubmitButton />
      </div>
    </form>
  );
}
