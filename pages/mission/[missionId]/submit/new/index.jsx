import { useRouter } from "next/router";
import { useRef } from "react";
import Editor from "../../../../../components/Editor";
import fetchWithRetry from "../../../../../functions/api";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function NewSubmit() {
    const router = useRouter();
    const editorRef = useRef(null);

    const handleSubmitMission = async () => {
        const submitContent = editorRef.current.editorInstance.getMarkdown();

        if (submitContent == null || submitContent === "") return;

        const submitFormData = new FormData();

        submitFormData.append("content", submitContent);

        const newMissionSubmitResponse = await fetchWithRetry(`/mission/${router.query.missionId}`, {
            method: "POST",
            body: submitFormData,
        });

        if (newMissionSubmitResponse.ok) {
            router.push(`/mission/${router.query.missionId}`);
        }
    }

    return <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>미션 제출</h1>
            <button onClick={handleSubmitMission}>제출하기</button>
        </div>
        <hr />
        <Editor editorRef={editorRef} />
    </>
}