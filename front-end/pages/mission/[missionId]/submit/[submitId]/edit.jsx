import { useRouter } from "next/router";
import { useRef } from "react";
import Editor from "../../../../../components/Editor";
import fetchWithRetry from "../../../../../functions/api";

export async function getServerSideProps(context) {
    const { missionId, submitId } = context.query;

    const getSubmitResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}`);

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

    const handleEditSubmit = async () => {
        const formData = new FormData();

        formData.append("content", editorRef.current.editorInstance.getMarkdown());

        const editSubmitResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/edit`, {
            method: "PUT",
            body: formData,
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