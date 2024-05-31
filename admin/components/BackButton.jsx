"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className }) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    return <button type="button" className={className?? ""} onClick={handleBack}>돌아가기</button>
}