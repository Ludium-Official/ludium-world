"use client";

import { useEffect, useRef, useState } from "react";
import SubmitComment from "../../../../../../components/mission/SubmitComment";
import Editor from "../../../../../../components/Editor";
import fetchWithRetry from "../../../../../../functions/api";
import missionstyle from "../../../../mission.module.css";
import { useRouter } from "next/navigation";

export default function CommentList({ comments, missionId, submitId }) {
  const [commentList, setCommentList] = useState(comments);
  const editorRef = useRef(null);
  const router = useRouter();

  const refreshComments = () => {
    router.refresh();
  };

  const handleNewSubmitComment = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("content", editorRef.current.editorInstance.getMarkdown());

    const createSubmitCommentResponse = await fetchWithRetry(
      `/mission/${missionId}/submit/${submitId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (createSubmitCommentResponse.ok) {
      editorRef.current.editorInstance.setMarkdown();
      refreshComments();
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const getCommentsResponse = await fetchWithRetry(
        `/mission/${missionId}/submit/${submitId}/comment`
      );

      if (!getCommentsResponse.ok) return;

      setCommentList(await getCommentsResponse.json());
    };

    getComments();
  });

  const handleBack = () => {
    router.push(`/mission/${missionId}/submit`);
  };

  return (
    <>
      <form onSubmit={handleNewSubmitComment}>
        <div
          className={`${missionstyle["form-button-area"]}`}
        >
          <button
            className={missionstyle["form-button"]}
            type="button"
            onClick={handleBack}
          >
            돌아가기
          </button>
          <input
            className={missionstyle["form-button"]}
            type="submit"
            value="댓글 추가하기"
          />
        </div>
        <div
          className={`${missionstyle["form-content-area"]} ${missionstyle["mission-comment"]}`}
        >
          <Editor editorRef={editorRef} height={"100%"} />
        </div>
      </form>
      <div className={missionstyle["comment-list"]}>
        <h1 className={`${missionstyle["mission-view-title"]} ${missionstyle["mission-view-title-no-background"]}`}>댓글 이력</h1>
        {commentList.map((comment) => (
          <SubmitComment
            key={comment.id}
            {...comment}
            missionId={missionId}
            submitId={submitId}
            handleCallback={refreshComments}
          />
        ))}
      </div>
    </>
  );
}
