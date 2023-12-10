"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api";

export default function ModuleCreateButton({ announceId }) {
    const router = useRouter();

    const handleCreateMake = async () => {
        const makeFormData = new FormData();

        makeFormData.append("title", "모듈 제목을 입력해주세요");

        const createModuleWithArticle = await fetchWithRetry(`/announcement/${announceId}`, {
            method: "POST",
            body: makeFormData
        });

        router.refresh();
    }
    return <button onClick={handleCreateMake}>모듈 추가하기</button>
}