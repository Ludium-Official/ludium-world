import { useRouter } from "next/router";
import { useRef } from "react";
import Viewer from "../../components/Viewer";

export async function getServerSideProps(context) {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { missionId } = context.query;

    const getMissionResponse = await fetch(`${serverUri}/mission/${missionId}`);

    if (!getMissionResponse.ok) {
        return {
            props: {
                missions: null,
                missionId
            }
        };
    }

    return {
        props: {
            mission: await getMissionResponse.json(),
            missionId
        }
    };
}

export default function GetMission({ mission, missionId }) {
    const router = useRouter();
    const viewerRef = useRef(null);

    const handleGoSubmit = () => {
        router.push(`/mission/${missionId}/submit/new`);
    }

    const handleGoMissionSubmit = () => {
        router.push(`/mission/${missionId}/submit`);
    }

    return <>
        <button onClick={handleGoSubmit}>미션제출하러가기</button>
        <button onClick={handleGoMissionSubmit}>미션 제출 보기</button>
        <input type="text" name="title" id="title" readOnly={true} value={mission.title} />
        <Viewer viewerRef={viewerRef} content={mission.content} />
    </>
}