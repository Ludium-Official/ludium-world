import { cookies } from "next/headers";
import MainWrapper from "../components/MainWrapper";
import Navigation from "../components/Navigation";
import "./global.css";

async function getNavigationLinks() {
  return [
    {
      id: crypto.randomUUID(),
      dir: "/profile?active=article",
      text: "프로필",
    },
    {
      id: crypto.randomUUID(),
      dir: "/announcement",
      text: "공고",
    },
    {
      id: crypto.randomUUID(),
      dir: "/work",
      text: "작업",
    },
    {
      id: crypto.randomUUID(),
      dir: "/learning",
      text: "학습제작",
    },
    {
      id: crypto.randomUUID(),
      dir: "/mission-management",
      text: "미션관리",
    },
    {
      id: crypto.randomUUID(),
      dir: "/management",
      text: "사용자 관리",
    },
    {
      id: crypto.randomUUID(),
      dir: "/apply",
      text: "지원서 관리",
    },
    {
      id: crypto.randomUUID(),
      dir: "/community",
      text: "커뮤니티",
    },
    // , {
    //     id: crypto.randomUUID(),
    //     dir: "/article",
    //     text: "아티클"
    // }, {
    //     id: crypto.randomUUID(),
    //     dir: "/post",
    //     text: "자유게시판"
    // }, {
    //     id: crypto.randomUUID(),
    //     dir: "/course",
    //     text: "교육"
    // }
  ];
}

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const links = await getNavigationLinks();

  return (
    <html lang="en">
      <head></head>
      <body style={{ margin: 0 }}>
        <main style={{ display: "flex" }}>
          <Navigation
            googleAuthInfo={cookieStore.get("access_token")}
            gglId={cookieStore.get("ggl_id")}
            links={links}
          />
          <MainWrapper>{children}</MainWrapper>
        </main>
      </body>
    </html>
  );
}
