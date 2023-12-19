"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../../../functions/api";

export default function MakeCreateButton({ announcementId, moduleId }) {
    const router = useRouter();

    const handleCreateMake = async () => {
        const makeFormData = new FormData();

        makeFormData.append("title", "제작 제목을 입력해주세요");

        await fetchWithRetry(`/announcement/${announcementId}/${moduleId}`, {
            method: "POST",
            body: makeFormData
        });

        router.refresh();
    }
    return <button onClick={handleCreateMake}>제작 추가하기</button>
}