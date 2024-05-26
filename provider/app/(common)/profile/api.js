"use server";

import { cookies } from "next/headers";

export default async function isLogined() {
  const cookieStore = cookies();

  if (
    cookieStore.get("access_token") == null ||
    cookieStore.get("ggl_id") == null
  )
    return false;

  return true;
}
