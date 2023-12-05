"use client";

import Link from "next/link";
import { useState } from "react";
import fetchWithRetry from "../../functions/api";
import Viewer from "../Viewer";
import submitstyle from "../../app/mission/mission.module.css";

export default function SubmitContent({
  id,
  content,
  vldStt,
  nick,
  missionId,
}) {
  const [submitData, setSubmitData] = useState({
    content: content,
    isValidate: vldStt,
  });
  const handleValidate = async (submitId) => {
    const validateMissionSubmitResponse = await fetchWithRetry(
      `/mission/${missionId}/submit/${submitId}/validate`,
      {
        method: "PUT",
      }
    );

    if (validateMissionSubmitResponse.ok) {
      setSubmitData({
        ...submitData,
        isValidate: true,
      });
    }
  };

  const handleInvalidate = async (submitId) => {
    const invalidateMissionSubmitResponse = await fetchWithRetry(
      `/mission/${missionId}/submit/${submitId}/invalidate`,
      {
        method: "PUT",
      }
    );

    if (invalidateMissionSubmitResponse.ok) {
      setSubmitData({
        ...submitData,
        isValidate: false,
      });
    }
  };

  return (
    <>
      <div
        className={`${submitstyle["mission-submit-item"]} ${submitstyle["mission-submit-item-vertical-center"]}`}
      >
        <Viewer content={submitData.content} />
      </div>
      <p className={submitstyle["mission-submit-item"]}>{nick}</p>
      {submitData.isValidate ? (
        <>
          <p className={submitstyle["mission-submit-item"]}>검증O</p>
          <div
            className={`${submitstyle["mission-submit-item"]} ${submitstyle["mission-submit-item-vertical-center"]}`}
          >
            <button onClick={() => handleInvalidate(id)}>검증해제</button>
          </div>
        </>
      ) : (
        <>
          <p className={submitstyle["mission-submit-item"]}>검증X</p>
          <div
            className={`${submitstyle["mission-submit-item"]} ${submitstyle["mission-submit-item-vertical-center"]}`}
          >
            <button
              className={submitstyle["mission-submit-item-button"]}
              onClick={() => handleValidate(id)}
            >
              검증
            </button>
          </div>
        </>
      )}
      <Link
        className={submitstyle["mission-submit-item"]}
        href={`/mission/${missionId}/submit/${id}/edit`}
      >
        수정
      </Link>
      <Link
        className={submitstyle["mission-submit-item"]}
        href={`/mission/${missionId}/submit/${id}/history`}
      >
        이력 확인
      </Link>
      <Link
        className={submitstyle["mission-submit-item"]}
        href={`/mission/${missionId}/submit/${id}/comment`}
      >
        댓글 작성하기
      </Link>
    </>
  );
}
