import Link from "next/link";
import fetchWithRetry from "../../functions/api";
import MissionList from "../../components/mission/MissionList";

async function getMissions() {
    const getMissionsResponse = await fetchWithRetry(`/mission`);

    if (!getMissionsResponse.ok) return [];

    return await getMissionsResponse.json();
}

export default async function MissionListPage() {
    const missions = await getMissions();

    return <>
        <Link href="/mission/new">글쓰기</Link>
        <h1>글 목록</h1>
        <MissionList missions={missions} />
    </>
}