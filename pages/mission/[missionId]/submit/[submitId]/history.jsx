import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SubmitHistory from "../../../../../components/mission/SubmitHistory";
import Link from "next/link";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}

export default function HistorySubmit() {
    const router = useRouter();
    const [submitHistory, setSubmitHistory] = useState([]);

    const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
    const { missionId, submitId } = router.query;

    useEffect(() => {
        const getSubmitHistory = async () => {
            const getSubmitHistoryResponse = await fetch(`${serverUri}/mission/${missionId}/submit/${submitId}/history`);

            if (getSubmitHistoryResponse.ok) {
                setSubmitHistory(await getSubmitHistoryResponse.json());
            }
        }

        getSubmitHistory();
    }, []);

    return (
        <>
            <Link href="../" as={`/mission/${missionId}/submit`}>미션 제출 목록으로 가기</Link>
            {submitHistory.map((history) => (
                <SubmitHistory key={history.id} {...history}/>
            ))}
        </>
    )
}