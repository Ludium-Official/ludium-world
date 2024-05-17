"use server";

import UnAuthorizedError from "@/errors/UnAuthorizedError";
import { cookies } from "next/headers";

const refreshAccessToken = async (options) => {
  const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
  const fetchInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    next: { revalidate: 0 },
  };

  if (options.headers !== undefined) {
    fetchInit.headers = {
      ...options.headers,
      "Content-Type": fetchInit.headers["Content-Type"],
    };
  }

  const tokenRefreshResponse = await fetch(
    `${serverUri}/auth/google/token-refresh`,
    fetchInit
  );

  if (!tokenRefreshResponse.ok) {
    throw new UnAuthorizedError("Failed to refresh access token");
  }

  return await tokenRefreshResponse.json();
};

const fetchWithRetry = async (url, options, maxRetry = 3) => {
  const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

  const retry = async (url, options, retryCount) => {
    const { headers } = { ...options };
    const cookieStore = cookies();

    if (headers != null) headers["Content-Type"] = "application/json";

    const response = await fetch(`${serverUri}${url}`, {
      ...options,
      credentials: "include",
      next: { revalidate: 0 },
      headers: headers ?? {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 && retryCount < maxRetry) {
      const refreshAccessTokenResponse = await refreshAccessToken(options);

      const token = refreshAccessTokenResponse.headers.cookie
        .split("access_token=")[1]
        .replace("\n", "");
      cookieStore.set("access_token", token);

      return retry(
        url,
        {
          ...options,
          ...refreshAccessTokenResponse,
        },
        retryCount + 1
      );
    }
    return response;
  };

  return retry(url, options, 0);
};

export default fetchWithRetry;
