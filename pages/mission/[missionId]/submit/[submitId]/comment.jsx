import { useEffect, useRef, useState } from "react";
import Editor from "../../../../../components/Editor";
import SubmitComment from "../../../../../components/mission/SubmitComment";

export async function getServerSideProps(context) {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { missionId, submitId } = context.query;

    const getCommentsResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}/comment`);

    if (!getCommentsResponse.ok) {
        return {
            props: {
                comments: [],
                missionId,
                submitId
            }
        };
    }

    return {
        props: {
            comments: await getCommentsResponse.json(),
            missionId,
            submitId
        }
    };
}

export default function CommentSubmit({ comments, missionId, submitId }) {
    const [commentList, setCommentList] = useState(comments);
    const [isUpdated, setIsUpdated] = useState(false);
    const editorRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

    const refreshComments = () => {
        setIsUpdated(true)
    }

    const handleNewSubmitComment = async () => {
        const formData = new FormData();

        formData.append("content", editorRef.current.editorInstance.getMarkdown());

        const createSubmitCommentResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}`, {
            method: "post",
            body: formData,
            credentials: "include",
        });

        if (createSubmitCommentResponse.ok) {
            editorRef.current.editorInstance.setMarkdown();
            refreshComments();
        }
    }

    useEffect(() => {
        if (!isUpdated) return;

        const getComments = async () => {
            const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
            const getCommentsResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}/comment`);

            if (!getCommentsResponse.ok) return;

            setCommentList(await getCommentsResponse.json());
            setIsUpdated(false);
        }

        getComments();
    }, [isUpdated]);

    return <>
        <h2>댓글 이력</h2>
        <hr />
        {commentList.map(comment => {
            return <SubmitComment key={comment.id} {...comment} missionId={missionId} submitId={submitId} handleCallback={refreshComments} />;
        })}
        <hr />
        <button onClick={handleNewSubmitComment}>댓글 추가</button>
        <Editor editorRef={editorRef} />
    </>
}