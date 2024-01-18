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
            <Link href="/">
              <Image
                src="/logo_purple.png"
                alt="ludium"
                width={156}
                height={70}
                priority
              />
            </Link>
          </li>
          <GoogleButton />
          <li>
            <Link className={navigationstyle.link} href="/announcement">
              공고
            </Link>
          </li>
          <li>
            <Link className={navigationstyle.link} href="/work">
              작업
            </Link>
          </li>
          <li>
            <Link className={navigationstyle.link} href="/participation">
              학습 참여
            </Link>
          </li>
          <li>
            <Link className={navigationstyle.link} href="/community">
              커뮤니티
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className={navigationstyle.wrapper}>
      <ul className={navigationstyle.list}>
        <li className={navigationstyle.logo}>
          <Link href="/">
            <Image
              src="/logo_purple.png"
              alt="ludium"
              width={156}
              height={70}
              priority
            />
          </Link>
        </li>
        {links.map(({ id, dir, text }) => (
          <li key={id}>
            <Link
              className={
                pathName.split("/")[1] === dir.split("/")[1]
                  ? `${navigationstyle.link} ${navigationstyle.active}`
                  : navigationstyle.link
              }
              href={dir}
            >
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
