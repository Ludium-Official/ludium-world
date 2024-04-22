"use server";

import UnAuthorizedError from "@/errors/UnAuthorizedError";
import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";

export async function getUserRight() {
  const cookieStore = cookies();
  const googleAuthInfo = cookieStore.get("access_token");
  const gglId = cookieStore.get("ggl_id");

  if (googleAuthInfo == null) return;
  if (gglId == null) return;

  const getUserRightResponse = await fetchWithRetry("/user/right", {
    headers: {
      cookie: cookieStore,
    },
  });

  if (!getUserRightResponse.ok) {
    if (getUserRightResponse.status === 401) throw new UnAuthorizedError();
    else throw new Error("getUserRightResponse is not ok");
  }

  const right = await getUserRightResponse.json();

  return right;
}
