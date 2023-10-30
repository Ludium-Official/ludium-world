import { useRef, useState } from "react";
import Viewer from "../Viewer";

export default function SubmitContent({ id, content, vldStt }) {
    const [submitData, setSubmitData] = useState({
        content: content,
        isValidate: vldStt
    })
    const viewerRef = useRef(null);

    const handleValidate = async (submitId) => {
        const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

        const validateMissionSubmitResponse = await fetch(`${serverUri}/mission/submit/validate/${submitId}`, {
            method: "put",
            credentials: "include"
        });

        if (validateMissionSubmitResponse.ok) {
            setSubmitData({
                ...submitData,
                isValidate: true
            });
        }
    }

    const handleInvalidate = async (submitId) => {
        const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

        const invalidateMissionSubmitResponse = await fetch(`${serverUri}/mission/submit/invalidate/${submitId}`, {
            method: "put",
            credentials: "include"
        });

        if (invalidateMissionSubmitResponse.ok) {
            setSubmitData({
                ...submitData,
                isValidate: false
            });
        }
    }

    return (
        <div key={id} style={{ display: "flex", justifyContent: "space-between" }}>
            <Viewer viewerRef={viewerRef} content={submitData.content} />
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
        </div>
    );
}