"use client";

import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function ApplyForm({
  announcementId,
  detailId,
  applicationTemplate,
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const editorRef = useRef();
  const handleApplyForm = async (e) => {
    e.preventDefault();
    setPending(true);
    const { editorInstance } = editorRef.current;

    const createApplyResponse = await fetchWithRetry(
      `/announcement/${announcementId}/${detailId}/application`,
      {
        method: "POST",
        body: JSON.stringify({
          ...applicationTemplate,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    if (!createApplyResponse.ok) {
      alert("지원서 제출하던 중 에러가 발생했습니다.");
      setPending(false);
    } else {
      alert("지원서 제출이 완료되었습니다.");
      router.replace(
        `/announcement/${announcementId}/${detailId}/apply/edit?role=${applicationTemplate.role}`
      );
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
          defaultValue={applicationTemplate.title}
          readOnly
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor
            editorRef={editorRef}
            height="100%"
            content={applicationTemplate.description}
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
