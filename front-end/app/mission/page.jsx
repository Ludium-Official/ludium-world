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
        text: "글쓰기"
    }];

    return <>
        <ContentNavigation links={links} />
        <h1>글 목록</h1>
        <MissionList missions={missions} />
    </>
}