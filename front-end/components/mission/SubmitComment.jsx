import { useRef } from "react";
import Viewer from "../Viewer";

export default function SubmitComment({ id, content, nick, createAt, missionId, submitId, handleCallback }) {
  const viewerRef = useRef(null);

  const handleDeleteComment = async () => {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

    const deleteCommentResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}/${id}`, {
      method: "delete",
      credentials: "include"
    });

    if (!deleteCommentResponse.ok) return;

    handleCallback();
  }

  return <div style={{ display: "flex", justifyContent: "space-between" }}>
    <Viewer viewerRef={viewerRef} content={content} />
    <p>{nick}</p>
    <p>{createAt}</p>
    <button>수정</button>
    <button onClick={handleDeleteComment}>삭제</button>
  </div>;
}