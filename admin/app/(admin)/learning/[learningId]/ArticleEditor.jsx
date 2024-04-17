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

export default function ArticleEditor({ article, postingId }) {
  const router = useRouter();
  const editorRef = useRef();
  const formRef = useRef();
  const [pending1, setPending1] = useState(false);

  const handleEditWorkContent = async (e) => {
    e.preventDefault();
    setPending1(true);
    const { editorInstance } = editorRef.current;

    const updateWorkContentResponse = await fetchWithRetry(
      `/learning/${postingId}/${article.curriculumId}/article`,
      {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          ...article,
          title: e.target.title.value,
          description: editorInstance.getMarkdown(),
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
          alert("아티클을 저장하는 중 에러가 발생했습니다.");
      }
    } else {
      alert("아티클이 저장되었습니다.");
      router.refresh();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleEditWorkContent}>
      <div className={learningstyle["learning-edit-reference-button-area"]}>
        <button disabled={pending1}>
          {pending1 ? "아티클을 수정하는 중입니다..." : "아티클 수정하기"}
        </button>
      </div>
      <details>
        <summary>[아티클] {article.title}</summary>
        <div className={learningstyle["learning-edit-header-area"]}>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={article.title}
            placeholder="아티클 제목을 입력해주세요"
          />
        </div>
        <input
          type="number"
          name="orderNum"
          id="orderNum"
          defaultValue={article.orderNum}
        />
        <div className={learningstyle["learning-edit-content-area"]}>
          <Editor
            editorRef={editorRef}
            content={article.description}
            height={"100%"}
          />
        </div>
      </details>
    </form>
  );
}
