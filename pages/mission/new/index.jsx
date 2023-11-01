import { useRouter } from "next/router";
import { useRef } from "react";
import Editor from "../../../components/Editor";

export default function NewMission() {
    const router = useRouter();
    const titleRef = useRef(null);
    const editorRef = useRef(null);

    const handleSave = async () => {
        const { editorInstance } = editorRef.current;
        const formData = new FormData();

        formData.append("title", titleRef.current.value);
        formData.append("content", editorInstance.getMarkdown());

        const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

        const createMissionResponse = await fetch(`${serverUri}/mission`, {
            method: "post",
            body: formData,
            credentials: "include"
        });

        if (createMissionResponse.ok) {
            router.push("/mission");
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