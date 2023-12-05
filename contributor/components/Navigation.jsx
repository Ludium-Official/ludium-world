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
          <li className={navigationstyle.logo}>
            <Image src="/logo_purple.png" alt="ludium" width={156} height={70} priority />
          </li>
          <GoogleButton />
          <li>
            <Link className={navigationstyle.link} href="/course">교육</Link>
          </li>
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
        {links.map(({ id, dir, text }) => <li key={id}>
          <Link className={(pathName.split("/")[1] === dir.split("/")[1]) ? `${navigationstyle.link} ${navigationstyle.active}` : navigationstyle.link} href={dir}>{text}</Link>
        </li>)}
      </ul>
    </nav>
  );
}
