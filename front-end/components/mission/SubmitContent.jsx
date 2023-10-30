import { useRef, useState } from "react";
import Viewer from "../Viewer";

export default function SubmitContent ({id, content, vldStt}) {
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

        if(validateMissionSubmitResponse.ok) {
            setSubmitData({
                ...submitData,
                isValidate: true
            });
        }
    }

    return (
        <div key={id} style={{ display: "flex", justifyContent: "space-between" }}>
          <Viewer viewerRef={viewerRef} content={submitData.content} />
          <div>{submitData.isValidate ? "검증O" : "검증X"}</div>
          <button onClick={() => handleValidate(id)}>검증</button>
        </div>
      );
}