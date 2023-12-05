import ContentNavigation from "../../components/ContentNavigation";
import MissionList from "../../components/mission/MissionList";
import fetchWithRetry from "../../functions/api";
import missinostyle from "./mission.module.css";

export const metadata = {
    title: "미션"
}

async function getMissions() {
    const getMissionsResponse = await fetchWithRetry(`/mission`);

    if (!getMissionsResponse.ok) return [];

    return await getMissionsResponse.json();
}

export default async function MissionListPage() {
    const missions = await getMissions();
    const links = [{
        href: "/mission/new",
        text: "미션 추가"
    }];

    return <>
        <div className={missinostyle["content-navigation"]}>
            <ContentNavigation links={links} />
        </div>
        <MissionList missions={missions} />
    </>
}