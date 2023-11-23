import SubmitContent from "../../../../components/mission/SubmitContent";
import fetchWithRetry from "../../../../functions/api";
import submitstyle from "../../mission.module.css"

async function getSubmitList(missionId) {
    const getMissionSumitResponse = await fetchWithRetry(`/mission/${missionId}/submit`);

    if (!getMissionSumitResponse.ok) return [];

    return await getMissionSumitResponse.json();
}

export default async function MissionSubmitListPage({ params }) {
    const { missionId } = params;
    const submitList = await getSubmitList(missionId);

    return <>
        <h1>미션 제출 목록</h1>
        <section className={submitstyle["section-header-wrapper"]}>
            <p>내용</p>
            <p>작성자</p>
            <p>검증 여부</p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
        </section>
        {
            submitList.map(submit =>
                <SubmitContent key={submit.id} missionId={missionId} {...submit} />)
        }
    </>
}