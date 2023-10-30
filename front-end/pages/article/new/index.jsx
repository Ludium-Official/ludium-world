import { useEffect, useRef, useState } from "react";
import Editor from "../../../components/Editor";
import { useRouter } from "next/router";

export default function NewArticle() {
  const router = useRouter();
  const titleRef = useRef(null);
  const editorRef = useRef(null);

  const handleSave = async () => {
    const { editorInstance } = editorRef.current;
    const formData = new FormData();

    formData.append("title", titleRef.current.value);
    formData.append("content", editorInstance.getMarkdown());

    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const createArticleResponse = await fetch(`${serverUri}/article`, {
      method: "post",
      body: formData,
      credentials: 'include'
    });

    if (createArticleResponse.ok) {
      router.push("/article");
    }
  }

  return (
    <>
      <button onClick={handleSave}>저장</button>
      <input type="text" name="title" id="title" ref={titleRef} placeholder="제목을 입력해주세요" />
      <Editor editorRef={editorRef} />
    </>
  )
}