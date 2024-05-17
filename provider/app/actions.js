"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import UnAuthorizedError from "@/errors/UnAuthorizedError";
import { cookies } from "next/headers";

export async function getUserRight() {
  const cookieStore = cookies();
  const googleAuthInfo = cookieStore.get("access_token");
  const gglId = cookieStore.get("ggl_id");

  if (googleAuthInfo == null) return;
  if (gglId == null) return;

  const getUserRightResponse = await fetchWithRetry("/user/right");

  const right = await getUserRightResponse.json();

  return right;
}

export const refreshAccessToken = async () => {
  const cookieStore = cookies();
  const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

  const tokenRefreshResponse = await fetch(
    `${serverUri}/auth/google/token-refresh`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        cookie: cookieStore,
      },
    }
  );

  if (!tokenRefreshResponse.ok) {
    throw new UnAuthorizedError("Failed to refresh access token");
  }

  return await tokenRefreshResponse.json();
};

const fetchWithRetry = async (url, options, maxRetry = 3) => {
  const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
  const cookieStore = cookies();

  const response = await fetch(`${serverUri}${url}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieStore,
    },
  });

  const { ok, status } = response;

  if (!ok) {
    console.log(status);
    if (status === 401) {
      throw new UnAuthorizedError("Failed to refresh access token.");
    } else {
      throw new Error("getUserRightResponse is not ok");
    }
  }

  return response;
};
