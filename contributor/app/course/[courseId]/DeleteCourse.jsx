"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api";

export default function DeleteCourse({courseId}) {
    const router = useRouter();
    const handleDeleteButton = async () => {
        const deleteCourseResponse = await fetchWithRetry(`/course/${courseId}`, {
            method: "DELETE"
        });

        if(!deleteCourseResponse.ok) {
            throw Error("교육을 삭제하던 중 에러가 발생했습니다.");
        }

        router.push(`/course`);
        router.refresh();
    }

    return <button onClick={handleDeleteButton}>삭제하기</button>
}