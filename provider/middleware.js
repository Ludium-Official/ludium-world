import { NextResponse } from "next/server";
import { getUserRight } from "./app/actions";
import { cookies } from "next/headers";

const isProviderAccessable = ({ prv, pathname }) => {
  const providerPattern = /^\/mission\/*/;

  if (providerPattern.test(pathname)) {
    if (prv) return true;
    else return false;
  }

  return true;
};

export default async function middlware(req) {
  const cookieStore = cookies();

  const pattern =
    /\/sign-up|^\/mission\/*|\/profile|^\/announcement\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\/apply$|^\/community\/(([^/]+)\/edit$|new)$/;

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

    return res;
  } catch (_) {
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png|.*\\.svg|.*\\.ico$).*)",
  ],
};
