"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import workstyle from "../work.module.css";
import WORK_CONTENT_STATUS from "@/enums/WORK_CONTENT_STATUS";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function WorkContentEditor({ detailContent }) {
  const router = useRouter();
  const editorRef = useRef();
  const formRef = useRef();
  const [pending1, setPending1] = useState(false);
  const [pending2, setPending2] = useState(false);

  const handleEditWorkContent = async (e) => {
    e.preventDefault();
    setPending1(true);
    const { editorInstance } = editorRef.current;

    const updateWorkContentResponse = await fetchWithRetry(
      `/detailed-announcement/${detailContent.detailId}/${detailContent.detailContentId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...detailContent,
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
        }),
      }
    );

    setPending1(false);
    if (!updateWorkContentResponse.ok) {
      switch (updateWorkContentResponse.status) {
        case 403:
        case 404: {
          const { message } = await updateWorkContentResponse.json();
          alert(message);
          break;
        }
        default:
          alert("작업물을 제출하는 중에 에러가 발생했습니다.");
      }
    } else {
      alert("작업물이 저장되었습니다.");
      router.refresh();
    }
  };

  const handleSubmitWorkContent = async () => {
    setPending2(true);
    const { editorInstance } = editorRef.current;

    const submitWorkContentResponse = await fetchWithRetry(
      `/detailed-announcement/${detailContent.detailId}/${detailContent.detailContentId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...detailContent,
          title: formRef.current.title.value,
          description: editorInstance.getMarkdown(),
          status: WORK_CONTENT_STATUS.SUBMIT,
        }),
      }
    );

    setPending2(false);
    if (!submitWorkContentResponse.ok) {
      switch (submitWorkContentResponse.status) {
        case 403:
        case 404: {
          const { message } = await submitWorkContentResponse.json();
          alert(message);
          break;
        }
        default:
          alert("작업물을 제출하는 중에 에러가 발생했습니다.");
      }
    } else {
      alert("작업물이 제출되었습니다.");
      router.refresh();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleEditWorkContent}>
      <div className={workstyle["work-edit-reference-button-area"]}>
        <button
          type="button"
          onClick={handleSubmitWorkContent}
          disabled={pending2}
        >
          {pending2 ? "작업물을 제출하는 중입니다..." : "작업물 제출하기"}
        </button>
        <button disabled={pending1}>
          {pending1 ? "작업물을 수정하는 중입니다..." : "작업물 수정하기"}
        </button>
      </div>
      <details className={workstyle["work-edit-wrapper"]} open={true}>
        <summary>작업물 펼치기 / 닫기</summary>
        <p>
          작업물 상태: {detailContent.status === "SUBMIT" ? "제출됨" : "생성됨"}
        </p>
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
