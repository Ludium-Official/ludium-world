import Link from "next/link";
import SubmitHistory from "../../../../../../components/mission/SubmitHistory";
import fetchWithRetry from "../../../../../../functions/api";

async function getSubmitHistory(missionId, submitId) {
    const getSubmitHistoryResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}/history`);

    if (!getSubmitHistoryResponse.ok) return [];

    return await getSubmitHistoryResponse.json();
}

export default async function SubmitHistoryPage({ params: { missionId, submitId } }) {
    const history = await getSubmitHistory(missionId, submitId);
    return <div>
        <Link href="../" as={`/mission/${missionId}/submit`}>미션 제출 목록으로 가기</Link>
        {history.map((item) => (
            <SubmitHistory key={item.id} {...item} />
        ))}
    </div>
}