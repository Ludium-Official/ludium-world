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
        <MissionSubmit missionId={router.query.missionId} />
    </>
}