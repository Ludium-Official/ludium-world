"use client";

import Link from "next/link";
import GoogleButton from "./GoogleButton";
import navigationstyle from "./Navigation.module.css";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navigation({ googleAuthInfo, gglId, links }) {
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

  return (
    <nav className={navigationstyle.wrapper}>
      <ul className={navigationstyle.list}>
        <li className={navigationstyle.logo}>
          <Image src="/logo_purple.png" alt="ludium" width={156} height={70} priority />
        </li>
        {links.map(({id ,dir, text}) => <li key={id}>
            <Link className={(pathName.split("/")[1] === dir.split("/")[1])? `${navigationstyle.link} ${navigationstyle.active}`: navigationstyle.link} href={dir}>{text}</Link>
        </li>)}
      </ul>
    </nav>
  );
}
