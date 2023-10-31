import { useRouter } from "next/router";
import Editor from "../../../../../components/Editor"
import { useEffect, useRef, useState } from "react";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}


export default function EditSubmit() {
    const [submitContent, setSubmitContent] = useState("");
    const router = useRouter();
    const editorRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { missionId, submitId } = router.query;

    const handleEditSubmit = async () => {
        const formData = new FormData();

        formData.append("content", editorRef.current.editorInstance.getMarkdown());

        const editSubmitResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}/edit`, {
            method: "put",
            body: formData,
            credentials: "include"
        });

        if (editSubmitResponse.ok) {
            router.replace({
                pathname: '../',
                query: { missionId }
            });
        }
    }

    useEffect(() => {
        const getSubmit = async () => {
            const { content } = await (await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}`)).json();

            setTimeout(() => {
                setSubmitContent(content);
            }, 500);
        }

        getSubmit();
    }, []);

    return <div>
        <button onClick={handleEditSubmit}>수정하기</button>
        <Editor editorRef={editorRef} content={submitContent} />
    </div>
}