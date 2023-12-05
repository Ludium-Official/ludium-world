import { cookies } from "next/headers";
import MainWrapper from "../components/MainWrapper";
import Navigation from "../components/Navigation";

async function getNavigationLinks() {
    return [{
        id: crypto.randomUUID(),
        dir: "/profile?active=article",
        text: "프로필"
    }, {
        id: crypto.randomUUID(),
        dir: "/course",
        text: "교육"
    }];
}

export default async function RootLayout({
    children
}) {
    const cookieStore = cookies();
    const links = await getNavigationLinks();

    return <html lang="en">
        <head>
        </head>
        <body style={{ margin: 0 }}>
            <main style={{ display: "flex" }}>
                <Navigation googleAuthInfo={cookieStore.get("access_token")} gglId={cookieStore.get("ggl_id")} links={links} />
                <MainWrapper>
                    {children}
                </MainWrapper>
            </main>
        </body>
    </html>
}