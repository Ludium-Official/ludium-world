"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../functions/api";

export default function DeleteButton({ deleteUrl }) {
    const router = useRouter();

    const handleDelete = async () => {
        const deleteResponse = await fetchWithRetry(deleteUrl, {
            method: "DELETE"
        });

        if(deleteResponse.ok){
            alert("삭제되었습니다.");
            router.back();
            router.refresh();
        }

    }

    return <button onClick={handleDelete}>삭제하기</button>
}