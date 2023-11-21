import Navigation from "../components/Navigation";
import { cookies } from "next/headers";

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
                {children}
            </main>
        </body>
    </html>
}