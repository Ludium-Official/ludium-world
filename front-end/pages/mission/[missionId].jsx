import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Viewer from "../../components/Viewer";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function GetMission() {
    const router = useRouter();
    const viewerRef = useRef(null);
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const [mission, setMission] = useState({ id: null, title: "", content: "" });

    const handleGoSubmit = () => {
        router.push(`/mission/${router.query.missionId}/submit/new`);
    }

    const handleGoMissionSubmit = () => {
        router.push(`/mission/${router.query.missionId}/submit`);
    }

    useEffect(() => {
        const getMission = async (missionId) => {
            if (missionId) {
                const getMissionResponse = await fetch(`${serverUri}/mission/${missionId}`);

                if (getMissionResponse.ok) {

                    const mission = await getMissionResponse.json();
                    setMission(mission);

                    if (viewerRef.current.viewerInstance === undefined) {
                        setTimeout(ref => {
                            if (ref.current === null) return;
                            const viewerInstance = ref.current.viewerInstance;

                            viewerInstance.setMarkdown(mission.content);
                        }, 1000, viewerRef);
                    } else {
                        const viewerInstance = viewerRef.current.viewerInstance;

                        viewerInstance.setMarkdown(mission.content);
                    }
                }
            }
        }

        getMission(router.query.missionId);
    }, []);

    return <>
        <button onClick={handleGoSubmit}>미션제출하러가기</button>
        <button onClick={handleGoMissionSubmit}>미션 제출 보기</button>
        <input type="text" name="title" id="title" readOnly={true} value={mission.title} />
        <Viewer viewerRef={viewerRef} />
    </>
}