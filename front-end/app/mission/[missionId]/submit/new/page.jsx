"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import Editor from "../../../../../components/Editor";
import fetchWithRetry from "../../../../../functions/api";
import { revalidatePath } from "next/cache";

export default function NewMissionSubmitPage({ params }) {
    const { missionId } = params;
    const router = useRouter();
    const editorRef = useRef(null);

    const handleSaveSubmitMission = async (e) => {
        e.preventDefault();

        const { editorInstance } = editorRef.current;
        const formData = new FormData();

        formData.append("content", editorInstance.getMarkdown());
        const newMissionSubmitResponse = await fetchWithRetry(`/mission/${missionId}`, {
            method: "POST",
            body: formData,
        });

        if (newMissionSubmitResponse.ok) {
            router.push(`/mission/${missionId}`);
            router.refresh();
        }
    }

    return <article>
        <h1>미션 제출</h1>
        <form onSubmit={handleSaveSubmitMission}>
            <input type="submit" value="제출하기" />
            <Editor editorRef={editorRef}></Editor>
        </form>
    </article>
        ;
}