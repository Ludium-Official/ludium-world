import { useRouter } from "next/router";
import { useRef } from "react";
import Editor from "../../../../../components/Editor";

export async function getServerSideProps(context) {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { missionId, submitId } = context.query;

    const getSubmitResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}`);

    if (!getSubmitResponse.ok) {
        return {
            props: {
                submit: null,
                missionId,
                submitId
            }
        }
    }

    return {
        props: {
            submit: await getSubmitResponse.json(),
            missionId,
            submitId
        }
    };
}


export default function EditSubmit({ submit, missionId, submitId }) {
    const router = useRouter();
    const editorRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

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
                pathname: "../",
                query: { missionId }
            });
        }
    }

    return <div>
        <button onClick={handleEditSubmit}>수정하기</button>
        <Editor editorRef={editorRef} content={submit.content} />
    </div>
}