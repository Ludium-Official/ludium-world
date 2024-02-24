import { cookies } from "next/headers";
import Navigation from "../components/Navigation";
import "./global.css";

export default async function RootLayout({ children }) {
  const cookieStore = cookies();

  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content={process.env.NEXT_PUBLIC_NAVER_SEARCH_ADVISOR}
        />
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE}
        />
      </head>
      <body className="body">
        <Navigation
          googleAuthInfo={cookieStore.get("access_token")}
          gglId={cookieStore.get("ggl_id")}
        />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
