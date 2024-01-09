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

export default function CurriculumEditor({ curriculum }) {
  const router = useRouter();
  const editorRef = useRef();
  const formRef = useRef();
  const [pending1, setPending1] = useState(false);

  const handleEditWorkContent = async (e) => {
    e.preventDefault();
    setPending1(true);
    const { editorInstance } = editorRef.current;

    const updateWorkContentResponse = await fetchWithRetry(
      `/learning/${curriculum.postingId}/${curriculum.curriculumId}`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...curriculum,
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
          alert("커리큘럼을 저장하는 중 에러가 발생했습니다.");
      }
    } else {
      alert("커리큘럼이 저장되었습니다.");
      router.refresh();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleEditWorkContent}>
      <div className={learningstyle["learning-edit-reference-button-area"]}>
        <button disabled={pending1}>
          {pending1 ? "커리큘럼을 수정하는 중입니다..." : "커리큘럼 수정하기"}
        </button>
      </div>
      <details open={true}>
        <summary>커리큘럼 펼치기 / 닫기</summary>
        <div className={learningstyle["learning-edit-header-area"]}>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={curriculum.title}
            placeholder="커리큘럼 제목을 입력해주세요"
          />
        </div>
        <div className={learningstyle["learning-edit-content-area"]}>
          <Editor
            editorRef={editorRef}
            content={curriculum.description}
            height={"100%"}
          />
        </div>
      </details>
    </form>
  );
}
