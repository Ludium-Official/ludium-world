import SubmitContent from "../../../../components/mission/SubmitContent";
import fetchWithRetry from "../../../../functions/api";

export async function getServerSideProps(context) {
    const { missionId } = context.query;

    const getMissionSumitResponse = await fetchWithRetry(`/mission/${missionId}/submit`);

    if (!getMissionSumitResponse.ok) {
        return {
            props: {
                submits: [],
                missionId
            }
        }
    }

    return {
        props: {
            submits: await getMissionSumitResponse.json(),
            missionId
        }
    };
}


export default function Submits({ submits, missionId }) {
    return <>
        <h1>미션 제출 목록</h1>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>내용</p>
            <p>작성자</p>
            <p>검증여부</p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
        </div>
        <hr />
        {
            submits.map(submit =>
                <SubmitContent key={submit.id} missionId={missionId} {...submit} />)
        }
    </>
}