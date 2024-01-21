"use client";

import { usePathname } from "next/navigation";
import Footer from "./aisde/Footer";
import GnbMenu from "./aisde/GnbMenu";
import Logo1 from "./aisde/Logo1";

export default function Navigation({ googleAuthInfo, gglId }) {
  const pathName = usePathname();

  if (pathName === "/sign-up") return null;

  const CLIENT_ID = process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_REDIRECT_URI;
  const RESPONSE_TYPE = process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_RESPONSE_TYPE;
  const SCOPE = process.env.NEXT_PUBLIC_OAUTH2_GOOGLE_SCOPE;

  return (
    <aside className="aside">
      <Logo1 />
      <nav className="gnb">
        {googleAuthInfo == null || gglId == null ? (
          <GnbMenu
            href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&access_type=offline&prompt=consent`}
            iconClass="icon-profile"
            src="logo_profile.svg"
            alt="profile"
            width={17.323}
            height={17.323}
            text="로그인"
          />
        ) : (
          <GnbMenu
            href="/profile"
            iconClass="icon-profile"
            src="logo_profile.svg"
            alt="profile"
            width={17.323}
            height={17.323}
            text="프로필"
          />
        )}
        <GnbMenu
          href="/announcement"
          iconClass="icon-announcement"
          src="icon_announcement.svg"
          alt="announcement"
          width={17.2}
          height={20.62}
          text="공고"
        />
        <GnbMenu
          href="/work"
          src="icon_note.svg"
          alt="work"
          width={24}
          height={24}
          text="작업"
        />
        <GnbMenu
          href="/participation"
          src="icon_learning.svg"
          alt="learning"
          width={24}
          height={24}
          text="학습 참여"
        />
        <GnbMenu
          href="/community"
          src="icon_community.svg"
          alt="community"
          width={24}
          height={24}
          text="커뮤니티"
        />
      </nav>
      <Footer />
    </aside>
  );
}
