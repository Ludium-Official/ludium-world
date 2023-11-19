import Link from "next/link";
import navigationstyle from "./Navigation.module.css";

export default function Navigation() {
    return <article className={navigationstyle.wrapper}>
        <Link href="/mission">미션</ Link>
        <Link href="/article">아티클</ Link>
        <Link href="/post">자유게시판</ Link>
        <Link href="/profile">프로필</Link>
        <Link href="/course">교육</Link>
    </article>
}