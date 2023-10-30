import { useEffect, useRef, useState } from "react";
import Editor from "../../../components/Editor";

export default function NewArticle() {
  const titleRef = useRef(null);
  const editorRef = useRef(null);

  const handleSave = async () => {
    const { editorInstance } = editorRef.current;
    const formData = new FormData();

    formData.append("title", titleRef.current.value);
    formData.append("content", editorInstance.getMarkdown());

    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    fetch(`${serverUri}/article`, {
      method: "post",
      body: formData,
      credentials : 'include'
    });
  }

  const handleLoad = _ => {
    const { editorInstance } = editorRef.current;
    editorInstance.setMarkdown(localStorage.getItem("md-content"));
  }

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad}>Load</button>
      <input type="text" name="title" id="title" ref={titleRef} placeholder="제목을 입력해주세요" />
      <Editor editorRef={editorRef} />
    </>
  )
}