import { useRouter } from "next/router";
import { useRef } from "react";
import MissionSubmit from "../../../../components/mission/Submit";

export async function getServerSideProps(context) {
    return {
        props: {}
    };
}


export default function GetSubmits() {
    const router = useRouter();

    return <>
        <h1>미션 제출 목록</h1>
        <hr />
        <MissionSubmit missionId={router.query.missionId} />
    </>
}