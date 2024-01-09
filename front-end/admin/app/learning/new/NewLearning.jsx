"use client";

import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import learningstyle from "../learning.module.css";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

export default function NewLearning() {
  const editorRef = useRef(null);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setPending(true);

    const { editorInstance } = editorRef.current;

    const createLearningResponse = await fetchWithRetry(`/learning`, {
      method: "POST",
      body: JSON.stringify({
        title: e.target.title.value,
        description: editorInstance.getMarkdown(),
      }),
    });

    if (createLearningResponse.ok) {
      router.push("/learning");
      router.refresh();
    }
  };

  const handleBack = () => {
    router.push("/learning");
  };

  return (
    <form className={learningstyle["form-wrapper"]} onSubmit={handleSave}>
      <div className={learningstyle["form-button-area"]}>
        <button
          className={learningstyle["form-button"]}
          type="button"
          onClick={handleBack}
        >
          돌아가기
        </button>
        <input
          className={learningstyle["form-button"]}
          type="submit"
          value={pending ? "공고를 저장하는 중입니다..." : "저장하기"}
          disabled={pending}
        />
      </div>
      <div className={learningstyle["form-header"]}>
        <input
          className={learningstyle["form-title"]}
          type="text"
          name="title"
          id="title"
          placeholder="제목을 입력해주세요"
        />
      </div>
      <div className={learningstyle["form-content-area"]}>
        <Editor editorRef={editorRef} height="100%" />
      </div>
    </form>
  );
}
