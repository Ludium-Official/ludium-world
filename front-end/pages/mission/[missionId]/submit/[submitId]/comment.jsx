import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Editor from "../../../../../components/Editor";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function CommentSubmit() {
    const [comments, setComments] = useState([]);
    const router = useRouter();
    const editorRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { missionId, submitId } = router.query;

    const handleNewSubmitComment = async () => {
        const formData = new FormData();

        formData.append("content", editorRef.current.editorInstance.getMarkdown());

        const createSubmitCommentResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}`, {
            method: "post",
            body: formData,
            credentials: "include",
        });

        if(createSubmitCommentResponse.ok) {
            setComments([...comments, await createSubmitCommentResponse.json()]);
        }
    }

    useEffect(() => {
        const getComments = async () => {
            const getCommentsResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}/comment`);

            if(getCommentsResponse.ok) {
                setComments(await getCommentsResponse.json());
            }
        }

        getComments();
    }, []);

    return (
        <>
            <button onClick={handleNewSubmitComment}>댓글 추가</button>
            <Editor editorRef={editorRef} />
            <h2>댓글 이력</h2>
            <hr />
            {comments.map(comment => (
                <div key={comment.id} style={{display: "flex", justifyContent: "space-between"}}>
                    <p>{comment.content}</p>
                    <p>{comment.usrId}</p>
                    <p>{comment.createAt}</p>
                </div>
            ))}
        </>
    );
}