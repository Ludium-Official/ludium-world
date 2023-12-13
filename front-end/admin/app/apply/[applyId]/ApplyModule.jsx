"use client";

import { useRouter } from "next/navigation";
import fetchWithRetry from "../../../functions/api";

export default function ApplyModule({ applyId, modules }) {
    const router = useRouter();
    const handleApplyModule = (e) => {
        e.preventDefault();
        const { module } = e.target;

        fetchWithRetry(`/apply/${applyId}/${module.value}`, {
            method: "PUT"
        });
        
        alert("모듈에 지원서 적용이 완료되었습니다.")
        router.refresh();
    }

    return <form onSubmit={handleApplyModule}>
        <select name="module" id="module">
            {modules.map(({ id, title }) => <option key={id} value={`${id}`}>{title}</option>)}
        </select>
        <button>적용하기</button>
    </form>
}