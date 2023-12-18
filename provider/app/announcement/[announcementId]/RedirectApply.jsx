"use client";

import { useRouter } from "next/navigation";
import announcementstyle from "../announcement.module.css";

export default function RedirectApply({ modules, announcementId }) {
    const router = useRouter();

    const handleRedirectApply = (e) => {
        e.preventDefault();

        if (e.target.apply.value === "") {
            alert("리스트에서 지원서를 작성할 모듈을 선택해주세요");
            return;
        };

        router.push(`/announcement/${announcementId}/module/${e.target.apply.value}/apply`);
        router.refresh();
    }

    return <form onSubmit={handleRedirectApply} className={announcementstyle["flex-end"]}>
        <select name="apply" id="apply">
            <option value="">지원서를 작성할 모듈을 선택해주세요</option>
            {modules.map(module => <option key={module.id} value={module.id}>{module.title}</option>)}
        </select>
        <div className={announcementstyle.button}>
            <button >지원서 작성하기</button>
        </div>
    </form>
}