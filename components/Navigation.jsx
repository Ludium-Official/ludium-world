"use client";

import Link from "next/link";
import GoogleButton from "./GoogleButton";
import navigationstyle from "./Navigation.module.css";
import { usePathname } from "next/navigation";

export default function Navigation({ googleAuthInfo, gglId }) {
    const pathName = usePathname();

    if (pathName === "/sign-up") return null;

    if (googleAuthInfo == null || gglId == null) {
        return <nav className={navigationstyle.wrapper}>
            <ul className={navigationstyle.list}>
                <GoogleButton />
                <Link href="/mission">미션</ Link>
                <Link href="/article">아티클</ Link>
                <Link href="/post">자유게시판</ Link>
                <Link href="/course">교육</Link>
            </ul>
        </nav>
    }

    return <nav className={navigationstyle.wrapper}>
        <ul className={navigationstyle.list}>
            <Link href="/profile">프로필</Link>
            <Link href="/mission">미션</ Link>
            <Link href="/article">아티클</ Link>
            <Link href="/post">자유게시판</ Link>
            <Link href="/course">교육</Link>
        </ul>
    </nav>
}