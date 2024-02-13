"use client";

import { useRef, useState } from "react";
import applystyle from "../apply.module.css";
import { useRouter } from "next/navigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function EditApplyForm({
  announcementId,
  detailId,
  application,
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const editorRef = useRef();
  const handleApplyForm = async (e) => {
    e.preventDefault();
    setPending(true);
    const { editorInstance } = editorRef.current;

    const updateApplyResponse = await fetchWithRetry(
      `/announcement/${announcementId}/${detailId}/application`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...application,
          description: editorInstance.getMarkdown(),
        }),
      }
    );
    setPending(false);

    if (!updateApplyResponse.ok) {
      const { message } = await updateApplyResponse.json();

      alert(message);
    } else {
      alert("지원서 제출이 완료되었습니다.");
      router.refresh();
    }
  };

  return (
    <form className="frame-116" onSubmit={handleApplyForm}>
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
        <button
          className="button-L-2 background-purple-01 h5-18 color-white"
          disabled={pending}
        >
          {pending ? "지원서를 제출하는 중입니다..." : "제출하기"}
        </button>
      </div>
    </form>
  );
}
