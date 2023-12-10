"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../../../functions/api";

export default function MakeCreateButton({ moduleId }) {
    const router = useRouter();

    const handleCreateMake = async () => {
        const makeFormData = new FormData();

        makeFormData.append("title", "제작 제목을 입력해주세요");

        const createMake = await fetchWithRetry(`/module/${moduleId}`, {
            method: "POST",
            body: makeFormData
        });

        router.refresh();
    }
    return <button onClick={handleCreateMake}>제작 추가하기</button>
}