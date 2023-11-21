import Link from "next/link";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import missionstyle from "./mission.module.css";

async function getMission(missionId) {
    const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

    if (!getMissionResponse.ok) return {
        title: "",
        content: ""
    }

    return await getMissionResponse.json();
}

export default async function MissionPage({ params }) {
    const { missionId } = params;
    const mission = await getMission(missionId);

    return <div>
        <nav className={missionstyle["nav-wrapper"]}>
            <ul className={missionstyle.list}>
                <li>
                    <Link href={`/mission/${missionId}/submit/new`}>미션제출하러가기</Link>
                </li>
                <li>
                    <Link href={`/mission/${missionId}/submit`}>미션제출보기</Link>
                </li>
            </ul>
        </nav>
        <h1 className={missionstyle.title}>{mission.title}</h1>
        <div className={missionstyle["content-wrapper"]}>
            <Viewer content={mission.content} />
        </div>
    </div>
}