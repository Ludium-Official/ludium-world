"use client";

import { useRouter } from "next/navigation";
import applystyle from "./apply.module.css";
import BackButton from "../../../../../../components/BackButton";
import ContentNavigation from "../../../../../../components/ContentNavigation";

export default function ApplyErrorPage({ error }) {
    const router = useRouter();

    const handleSignUp = () => {
        router.replace("/sign-up");
    }

    if (error.message === "423") {
        setTimeout(() => {
            router.replace(`${location.pathname.replace("/edit", "")}/edit`);
        }, 2000);

        return <>
            <article className={`${applystyle.wrapper} ${applystyle.error}`}>
                <h1 className={applystyle.title}>
                    이미 지원서를 제출했습니다. 곧 지원서 수정페이지로 연결됩니다.
                </h1>
            </article >
        </>
    }

    return <article className={`${applystyle.wrapper} ${applystyle.error}`}>
        <h1>로그인 혹은 회원가입을 먼저 해주세요.</h1>
        <button onClick={handleSignUp}>회원가입 하러 가기</button>
    </article>
}