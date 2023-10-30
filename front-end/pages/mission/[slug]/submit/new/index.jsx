import { useRouter } from "next/router";
import { useRef } from "react";
import Editor from "../../../../../components/Editor";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function newSubmit() {
    const router = useRouter();
    const editorRef = useRef(null);

    const handleSubmitMission = () => {
        const submitContent = editorRef.current.editorInstance.getMarkdown();

        if (submitContent == null || submitContent === "") return;

        const submitFormData = new FormData();

        submitFormData.append("content", submitContent);

        const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

        fetch(`${serverUri}/mission/${router.query.slug}`, {
            method: "post",
            body: submitFormData,
            credentials: "include"
        })
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