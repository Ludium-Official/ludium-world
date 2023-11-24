"use client";

import Link from "next/link";
import GoogleButton from "./GoogleButton";
import navigationstyle from "./Navigation.module.css";
import { usePathname } from "next/navigation";

const links = [{
    dir: "/profile",
    text: "프로필"
},{
    dir: "/mission",
    text: "미션"
}, {
    dir: "/article",
    text: "아티클"
}, {
    dir: "/post",
    text: "자유게시판"
}, {
    dir: "/course",
    text: "교육"
}]

export default function Navigation({ googleAuthInfo, gglId }) {
  const pathName = usePathname();

  if (pathName === "/sign-up") return null;

  if (googleAuthInfo == null || gglId == null) {
    return (
      <nav className={navigationstyle.wrapper}>
        <ul className={navigationstyle.list}>
          <GoogleButton />
          <li>
            <Link href="/mission">미션</Link>
          </li>
          <Link href="/article">아티클</Link>
          <Link href="/post">자유게시판</Link>
          <Link href="/course">교육</Link>
        </ul>
      </nav>
    );
  }

  console.log()

  return (
    <nav className={navigationstyle.wrapper}>
      <ul className={navigationstyle.list}>
        {links.map(({dir, text}) => <li key={crypto.randomUUID()}>
            <Link className={(pathName.split("/")[1] === dir.split("/")[1])? `${navigationstyle.link} ${navigationstyle.active}`: navigationstyle.link} href={dir}>{text}</Link>
        </li>)}
        {/* <li>
          <Link href="/profile">프로필</Link>
        </li>
        <li>
          <Link href="/mission">미션</Link>
        </li>
        <li>
          <Link href="/article">아티클</Link>
        </li>
        <li>
          <Link href="/post">자유게시판</Link>
        </li>
        <li>
          <Link href="/course">교육</Link>
        </li> */}
      </ul>
    </nav>
  );
}