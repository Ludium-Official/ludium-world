import Link from "next/link";
import SubmitHistory from "../../../../../components/mission/SubmitHistory";

export async function getServerSideProps(context) {
    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { missionId, submitId } = context.query;

    const getSubmitHistoryResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}/history`);

    if (!getSubmitHistoryResponse.ok) {
        return {
            props: {
                history: [],
                missionId
            }
        };
    }

    return {
        props: {
            history: await getSubmitHistoryResponse.json(),
            missionId
        }
    };
}

export default function HistorySubmit({ history, missionId }) {
    return <>
        <Link href="../" as={`/mission/${missionId}/submit`}>미션 제출 목록으로 가기</Link>
        {history.map((item) => (
            <SubmitHistory key={item.id} {...item} />
        ))}
    </>
}