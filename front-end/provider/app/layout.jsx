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
      dir: "/participation",
      text: "학습참여",
    },
  ];
}

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const links = await getNavigationLinks();

  return (
    <html lang="en">
      <head></head>
      <body style={{ margin: 0 }}>
        <main>
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
