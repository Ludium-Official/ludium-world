"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import fetchWithRetry from "../functions/api";
import Editor from "./Editor";

export default function SubmitEditContent({ missionId, submitId, content }) {
    const router = useRouter();
    const editorRef = useRef(null);

    const handleEditSubmit = async () => {
        const formData = new FormData();

        formData.append("content", editorRef.current.editorInstance.getMarkdown());

        const editSubmitResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/edit`, {
            method: "PUT",
            body: formData,
        });

        if (editSubmitResponse.ok) {
            router.push(`/mission/${missionId}/submit`, undefined, { shallow: true });
            router.refresh();
        }
    }

    return <>
        <button onClick={handleEditSubmit}>수정하기</button>
        <Editor editorRef={editorRef} content={content} />
    </>
}