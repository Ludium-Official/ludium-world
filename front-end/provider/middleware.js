import { NextResponse } from "next/server";
import { getUserRight, refreshAccessToken } from "./app/actions";
import { cookies } from "next/headers";
import UnAuthorizedError from "./errors/UnAuthorizedError";

const isProviderAccessable = ({ prv, pathname }) => {
  const providerPattern = /^\/mission\/*/;

  if (providerPattern.test(pathname)) {
    if (prv) return true;
    else return false;
  }

  return true;
};

const isAdminAccessable = ({ adm, pathname }) => {
  const adminPattern =
    /^\/announcement-management\/*|^\/work-management\/*|^\/learning-management\/*|^\/community-management\/*|^\/user-management\/*/;

  if (adminPattern.test(pathname)) {
    if (adm) return true;
    else return false;
  }

  return true;
};

export default async function middlware(req) {
  const cookieStore = cookies();

  const pattern =
    /\/sign-up|^\/mission\/*|\/profile|^\/announcement\/([^/]+)\/([^/]+)\/apply$|^\/community\/(([^/]+)\/edit$|new)$|^\/announcement-management\/*|^\/work-management\/*|^\/learning-management\/*|^\/community-management\/*|^\/user-management\/*/;

  const { pathname } = req.nextUrl;

  if (pattern.test(pathname)) {
    if (cookieStore.get("access_token") == null)
      return NextResponse.redirect(new URL("/", req.url));

    if (pathname === "/sign-up") {
      try {
        const userRight = await getUserRight();

        const res = NextResponse.redirect(new URL("/", req.url));
        res.headers.set("x-user-right", JSON.stringify(userRight));

        return res;
      } catch (_) {
        const res = NextResponse.next();

        res.headers.set("x-path-name", pathname);
        return res;
      }
    }
  }

  try {
    const userRight = await getUserRight();
    const res = NextResponse.next();
    const rootPath = NextResponse.redirect(new URL("/", req.url));

    if (userRight == null) return res;

    res.headers.set("x-user-right", JSON.stringify(userRight));
    rootPath.headers.set("x-user-right", JSON.stringify(userRight));

    if (!isProviderAccessable({ ...userRight, pathname })) {
      return rootPath;
    }

    if (!isAdminAccessable({ ...userRight, pathname })) {
      return rootPath;
    }

    return res;
  } catch (error) {
    if (error instanceof UnAuthorizedError) {
      const refreshPage = NextResponse.redirect(req.url);
      const result = await refreshAccessToken();
      const cookieOption = {
        maxAge: 604800,
        sameSite: "none",
        httpOnly: true,
        secure: true,
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      };

      refreshPage.cookies.set(
        "ggl_id",
        result.headers.cookie.split("ggl_id=")[1].split(";")[0],
        cookieOption
      );

      refreshPage.cookies.set(
        "access_token",
        result.headers.cookie.split("access_token=")[1].replace("\n", ""),
        cookieOption
      );

      return refreshPage;
    }
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png|.*\\.svg|.*\\.ico$).*)",
  ],
};
