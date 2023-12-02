"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api"

export default function DeleteMission({missionId}) {
    const router = useRouter();
    const handleDeleteMission = async () => {
        const deleteMissionResponse = await fetchWithRetry(`/mission/${missionId}`, {
            method: "DELETE"
        });

        if(!deleteMissionResponse.ok) {
            throw Error("미션을 삭제하는 중 에러가 발생했습니다.");
        }

        router.push("/mission");
        router.refresh();
    }
    return <button onClick={handleDeleteMission}>삭제하기</button>
}