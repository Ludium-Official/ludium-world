import { cookies } from "next/headers";
import MainWrapper from "../components/MainWrapper";
import Navigation from "../components/Navigation";
import "./global.css";

export default async function RootLayout({ children }) {
  const cookieStore = cookies();

  return (
    <html lang="en">
      <head></head>
      <body>
        <main className="main">
          <Navigation
            googleAuthInfo={cookieStore.get("access_token")}
            gglId={cookieStore.get("ggl_id")}
          />
          <MainWrapper>{children}</MainWrapper>
        </main>
      </body>
    </html>
  );
}
