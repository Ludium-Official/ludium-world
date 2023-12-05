import fetchWithRetry from "../../../../../../functions/api";
import SubmitEditContent from "../../../../../../components/SubmitEditContent";

async function getSubmit(missionId, submitId) {
    const getSubmitResponse = await fetchWithRetry(`/mission/${missionId}/submit/${submitId}`);

    if (!getSubmitResponse.ok) return {
        content: null
    };

    return await getSubmitResponse.json();
}

export default async function SubmitEditPage({ params: { missionId, submitId } }) {
    const submit = await getSubmit(missionId, submitId);

    return <div>
        <SubmitEditContent missionId={missionId} submitId={submitId} content={submit.content}></SubmitEditContent>
    </div>
}