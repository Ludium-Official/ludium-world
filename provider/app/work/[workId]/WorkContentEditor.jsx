"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import workstyle from "../work.module.css";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function WorkContentEditor({ detailContent }) {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);

  const handleEditWorkContent = async (e) => {
    e.preventDefault();
    setPending(true);
    const { editorInstance } = editorRef.current;

    const updateWorkContentResponse = await fetchWithRetry(
      `/detailed-announcement/${detailContent.detailId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...detailContent,
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    setPending(false);
    if (!updateWorkContentResponse.ok) {
      alert("작업물을 저장하는 중에 에러가 발생했습니다.");
    } else {
      alert("작업물이 저장되었습니다.");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleEditWorkContent}>
      <div className={workstyle["work-edit-reference-button-area"]}>
        <button type="button">작업물 제출하기</button>
        <button disabled={pending}>
          {pending ? "작업물을 수정하는 중입니다..." : "작업물 수정하기"}
        </button>
      </div>
      <details className={workstyle["work-edit-wrapper"]} open={true}>
        <div className={workstyle["work-edit-header-area"]}>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={detailContent.title}
            placeholder="작업물 제목을 입력해주세요"
          />
        </div>
        <div className={workstyle["work-edit-content-area"]}>
          <Editor
            editorRef={editorRef}
            content={detailContent.description}
            height={"100%"}
          />
        </div>
      </details>
    </form>
  );
}
