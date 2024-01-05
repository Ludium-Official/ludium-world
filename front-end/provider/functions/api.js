const refreshAccessToken = async (options) => {
  const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
  const fetchInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    cache: "no-store",
  };

  if (options.headers !== undefined) {
    fetchInit.headers = {
      ...options.headers,
      ...fetchInit.headers["Content-Type"],
    };
  }

  const tokenRefreshResponse = await fetch(
    `${serverUri}/auth/google/token-refresh`,
    fetchInit
  );

  if (!tokenRefreshResponse.ok) {
    throw new Error("Failed to refresh access token");
  }
  return await tokenRefreshResponse.json();
};

const fetchWithRetry = (url, options, maxRetry = 3) => {
  const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;

  const retry = async (url, options, retryCount) => {
    const response = await fetch(`${serverUri}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
      credentials: "include",
      cache: "no-store",
    });
    if (response.status === 401 && retryCount < maxRetry) {
      const refreshAccessTokenResponse = await refreshAccessToken(options);

      return retry(
        url,
        {
          ...options,
          ...refreshAccessTokenResponse,
          headers: {
            "Content-Type": "application/json",
          },
        },
        retryCount + 1
      );
    }
    return response;
  };

  return retry(url, options, 0);
};

export default fetchWithRetry;
