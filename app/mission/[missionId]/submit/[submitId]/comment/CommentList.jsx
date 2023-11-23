"use client";

import { useEffect, useRef, useState } from "react";
import SubmitComment from "../../../../../../components/mission/SubmitComment";
import Editor from "../../../../../../components/Editor";
import fetchWithRetry from "../../../../../../functions/api";
import missionstyle from "../../../../mission.module.css";

export default function CommentList({ comments, missionId, submitId }) {
  const [commentList, setCommentList] = useState(comments);
  const [isUpdated, setIsUpdated] = useState(false);
  const editorRef = useRef(null);

  const refreshComments = () => {
    setIsUpdated(true)
  }

  const handleNewSubmitComment = async () => {
    const formData = new FormData();

    formData.append("content", editorRef.current.editorInstance.getMarkdown());

    const createSubmitCommentResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}`, {
      method: "POST",
      body: formData,
    });

    if (createSubmitCommentResponse.ok) {
      editorRef.current.editorInstance.setMarkdown();
      refreshComments();
    }
  }

  useEffect(() => {
    if (!isUpdated) return;

    const getComments = async () => {
      const getCommentsResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/comment`);

      if (!getCommentsResponse.ok) return;

      setCommentList(await getCommentsResponse.json());
      setIsUpdated(false);
    }

    getComments();
  }, [isUpdated]);

  return <>
    <button onClick={handleNewSubmitComment}>댓글 추가</button>
    <Editor editorRef={editorRef} height={"400px"} />
    <div className={missionstyle["comment-list"]}>
      {commentList.map(comment => <SubmitComment key={comment.id} {...comment} missionId={missionId} submitId={submitId} handleCallback={refreshComments} />)}
    </div>
  </>
};