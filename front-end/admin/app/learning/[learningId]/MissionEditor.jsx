"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import learningstyle from "../learning.module.css";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function MissionEditor({ mission, postingId }) {
  const router = useRouter();
  const editorRef = useRef();
  const submitFormEditorRef = useRef();
  const formRef = useRef();
  const [pending1, setPending1] = useState(false);

  const handleEditWorkContent = async (e) => {
    e.preventDefault();
    setPending1(true);
    const { editorInstance } = editorRef.current;
    const submitFormEditorInstance = submitFormEditorRef.current.editorInstance;

    const updateWorkContentResponse = await fetchWithRetry(
      `/learning/${postingId}/${mission.curriculumId}/mission`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...mission,
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
          missionSubmitForm: submitFormEditorInstance.getMarkdown(),
          orderNum: e.target.orderNum.value,
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
          alert("미션을 저장하는 중 에러가 발생했습니다.");
      }
    } else {
      alert("미션이 저장되었습니다.");
      router.refresh();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleEditWorkContent}>
      <div className={learningstyle["learning-edit-reference-button-area"]}>
        <button disabled={pending1}>
          {pending1 ? "미션을 수정하는 중입니다..." : "미션 수정하기"}
        </button>
      </div>
      <details open={true}>
        <summary>미션 펼치기 / 닫기</summary>
        <div className={learningstyle["learning-edit-header-area"]}>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={mission.title}
            placeholder="미션 제목을 입력해주세요"
          />
        </div>
        <input type="number" name="orderNum" id="orderNum" defaultValue={mission.orderNum} />
        <h4>미션 내용</h4>
        <div className={learningstyle["learning-edit-content-area"]}>
          <Editor
            editorRef={editorRef}
            content={mission.description}
            height={"100%"}
          />
        </div>
        <h4>미션 제출 양식</h4>
        <div className={learningstyle["learning-edit-content-area"]}>
          <Editor
            editorRef={submitFormEditorRef}
            content={mission.missionSubmitForm}
            height={"100%"}
          />
        </div>
      </details>
    </form>
  );
}
