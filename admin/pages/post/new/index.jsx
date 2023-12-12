import { useRouter } from "next/router";
import { useRef } from "react";
import fetchWithRetry from "../../../functions/api";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../../components/Editor"), { ssr: false });

export default function NewPost() {
  const router = useRouter();
  const titleRef = useRef(null);
  const editorRef = useRef(null);

  const handleSave = async () => {
    const { editorInstance } = editorRef.current;
    const formData = new FormData();

    formData.append("title", titleRef.current.value);
    formData.append("content", editorInstance.getMarkdown());

    const createPostResponse = await fetchWithRetry(`/post`, {
      method: "POST",
      body: formData,
    });

    if (createPostResponse.ok) {
      router.push("/post");
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