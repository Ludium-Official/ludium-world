import ContentNavigation from "../../components/ContentNavigation";
import MissionList from "../../components/mission/MissionList";
import fetchWithRetry from "../../functions/api";

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
        <ContentNavigation links={links} />
        <MissionList missions={missions} />
    </>
}