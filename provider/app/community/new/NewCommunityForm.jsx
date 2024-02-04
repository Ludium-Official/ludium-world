"use client";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export default function NewCommunityForm() {
  const router = useRouter();
  const editorRef = useRef();
  const [pending, setPending] = useState(false);

  const handleCreateContent = async (e) => {
    e.preventDefault();
    setPending(true);

    const { editorInstance } = editorRef.current;

    const createContentResponse = await fetchWithRetry(`/content`, {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({
        title: e.target.title.value,
        description: editorInstance.getMarkdown(),
      }),
    });

    setPending(false);

    if (!createContentResponse.ok) {
      alert("콘텐츠를 저장하는 중 에러가 발생했습니다.");
      return;
    }

    alert("콘텐츠가 저장되었습니다.");
    router.back();
    router.refresh();
  };

  const handleIgnoreEnterKeyDown = (keydownEvent) => {
    if (keydownEvent.key === "Enter") keydownEvent.preventDefault();
  };

  return (
    <form className="frame-116" onSubmit={handleCreateContent}>
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
          onKeyDown={handleIgnoreEnterKeyDown}
        />
      </div>
      <div className="input-2">
        <p className="h5-18 color-gray-03">내용</p>
        <div className="frame-102-4 background-white content-editor">
          <Editor editorRef={editorRef} content="" height="100%" />
        </div>
      </div>
      <div className="frame-157">
        <button
          className="button-L-2 background-purple-01 h5-18 color-white"
          disabled={pending}
        >
          {pending ? "저장하는 중입니다..." : "저장하기"}
        </button>
      </div>
    </form>
  );
}
