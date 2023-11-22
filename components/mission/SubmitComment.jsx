import { useRef, useState } from "react";
import Viewer from "../Viewer";
import Editor from "../Editor";
import fetchWithRetry from "../../functions/api";

export default function SubmitComment({ id, content, nick, createAt, missionId, submitId, handleCallback }) {
  const editorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditComment = () => {
    setIsEditing(true);
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
  }

  const handleSaveEdit = async () => {
    const { editorInstance } = editorRef.current;
    const formData = new FormData();
    formData.append("content", editorInstance.getMarkdown());

    const updateCommentResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!updateCommentResponse.ok) return;

    handleCallback();
    setIsEditing(false);
  }


  const handleDeleteComment = async () => {
    const deleteCommentResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/${id}`, {
      method: "DELETE",
    });

    if (!deleteCommentResponse.ok) return;

    handleCallback();
  }

  return <>
    {isEditing ? <>
      <Editor editorRef={editorRef} content={content} />
      <button onClick={handleSaveEdit}>저장</button>
      <button onClick={handleCancelEdit}>취소</button>
    </> :
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Viewer content={content} />
        <p>{nick}</p>
        <p>{createAt}</p>
        <button onClick={handleEditComment}>수정</button>
        <button onClick={handleDeleteComment}>삭제</button>
      </div>
    }
  </>
}