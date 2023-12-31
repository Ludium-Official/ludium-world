"use client";

import { useRouter } from "next/navigation";
import profilestyle from "./profile.module.css";

export default function ProfileErrorPage({
    error,
    reset,
}) {
    const router = useRouter();

    const handleSignUp = () => {
        router.replace("/sign-up");
    }

    return <div className={profilestyle["profile-wrapper"]}>
        <h1>로그인 혹은 회원가입을 먼저 해주세요.</h1>
        <button onClick={handleSignUp}>회원가입 하러 가기</button>
    </div>
}