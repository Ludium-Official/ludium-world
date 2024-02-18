import { cookies } from "next/headers";
import Navigation from "../components/Navigation";
import "./global.css";

export default async function RootLayout({ children }) {
  const cookieStore = cookies();

  return (
    <html lang="en">
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
      <body>
        <main className="main">
          <Navigation
            googleAuthInfo={cookieStore.get("access_token")}
            gglId={cookieStore.get("ggl_id")}
          />
          {children}
        </main>
      </body>
    </html>
  );
}
