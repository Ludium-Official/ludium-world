"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();

  cookieStore.set("access_token", null, {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    secure: true,
    maxAge: 0,
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });

  cookieStore.set("ggl_id", null, {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    secure: true,
    maxAge: 0,
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  });

  redirect("/");
}
