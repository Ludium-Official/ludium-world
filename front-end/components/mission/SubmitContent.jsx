import Link from "next/link";
import { useRef, useState } from "react";
import Viewer from "../Viewer";
import fetchWithRetry from "../../functions/api";

export default function SubmitContent({ id, content, vldStt, nick, missionId }) {
    const [submitData, setSubmitData] = useState({
        content: content,
        isValidate: vldStt
    })
    const viewerRef = useRef(null);

    const handleValidate = async (submitId) => {
        const validateMissionSubmitResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/validate`, {
            method: "PUT",
        });

        if (validateMissionSubmitResponse.ok) {
            setSubmitData({
                ...submitData,
                isValidate: true
            });
        }
    }

    const handleInvalidate = async (submitId) => {
        const invalidateMissionSubmitResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/invalidate`, {
            method: "PUT",
        });

        if (invalidateMissionSubmitResponse.ok) {
            setSubmitData({
                ...submitData,
                isValidate: false
            });
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Viewer viewerRef={viewerRef} content={submitData.content} />
            <p>{nick}</p>
            {submitData.isValidate ?
                <>
                    <p>검증O</p>
                    <button onClick={() => handleInvalidate(id)}>검증해제</button>
                </> :
                <>
                    <p>검증X</p>
                    <button onClick={() => handleValidate(id)}>검증</button>
                </>
            }
            <Link href={`/mission/${missionId}/submit/${id}/edit`}>수정</Link>
            <Link href={`/mission/${missionId}/submit/${id}/history`}>이력 확인</Link>
            <Link href={`/mission/${missionId}/submit/${id}/comment`}>댓글 작성하기</Link>
        </div>
    );
}