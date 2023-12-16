"use client";

import { useRouter } from "next/navigation";
import applystyle from "./apply.module.css";

export default function ApplyErrorPage({error}) {
    const router = useRouter();

    const handleSignUp = () => {
        router.replace("/sign-up");
    }

    return <article className={`${applystyle.wrapper} ${applystyle.error}`}>
        <h1>로그인 혹은 회원가입을 먼저 해주세요.</h1>
        <button onClick={handleSignUp}>회원가입 하러 가기</button>
    </article>
}