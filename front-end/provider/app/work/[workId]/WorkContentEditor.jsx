"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function WorkContentEditor({ detailContent, isEditor }) {
  const router = useRouter();
  const editorRef = useRef();
  const formRef = useRef();
  const [pending, setPending] = useState(!isEditor);

  const handleEditWorkContent = async (e) => {
    e.preventDefault();
    setPending(true);
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

    setPending(false);
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

  const handleIgnoreEnterKeyDown = (keydownEvent) => {
    if (keydownEvent.key === "Enter") keydownEvent.preventDefault();
  };

  return (
    <form className="frame-116" ref={formRef} onSubmit={handleEditWorkContent}>
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
        <button
          className="button-L-2 background-purple-01 h5-18 color-white"
          disabled={pending}
        >
          {!isEditor
            ? "작업자만 저장할 수 있습니다"
            : pending
            ? "저장하는 중입니다..."
            : "저장하기"}
        </button>
      </div>
    </form>
  );
}
