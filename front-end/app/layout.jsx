import { cookies } from "next/headers";
import MainWrapper from "../components/MainWrapper";
import Navigation from "../components/Navigation";

export default function RootLayout({
    children
}) {
    const cookieStore = cookies();

    return <html lang="en">
        <head>
        </head>
        <body>
            <main style={{ display: "flex" }}>
                <Navigation googleAuthInfo={cookieStore.get("access_token")} gglId={cookieStore.get("ggl_id")} />
                <MainWrapper>
                    {children}
                </MainWrapper>
            </main>
        </body>
    </html>
}