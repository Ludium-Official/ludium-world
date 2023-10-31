import { useEffect, useState } from "react";
import SubmitContent from "./SubmitContent";

export default function MissionSubmit({ missionId }) {
    const [submits, setSubmits] = useState([]);
    
    useEffect(() => {
        const getMissionSubmits = async () => {
            const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
            const getMissionSumitResponse = await fetch(`${serverUri}/mission/${missionId}/submit`);

            if (getMissionSumitResponse.ok) {
                setSubmits(await getMissionSumitResponse.json());
            }
        };

        getMissionSubmits();
    }, []);

    return (
        <div>
          {submits.map((submit) => <SubmitContent key={submit.id} {...submit} missionId = {missionId} />)}
        </div>
      );
      
}