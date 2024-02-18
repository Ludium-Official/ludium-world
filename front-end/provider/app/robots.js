export default function robots() {
  const rules = [];
  const isNaverSearchAllow =
    process.env.NEXT_PUBLIC_NAVER_SEARCH_ADVISOR !== "" &&
    process.env.NEXT_PUBLIC_NAVER_SEARCH_ADVISOR != null;

  const isGoogleSearchAllow =
    process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE !== "" &&
    process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE != null;

  const sitemap = process.env.NEXT_PUBLIC_SITE_MAP_URL;

  if (isNaverSearchAllow === true) {
    rules.push({
      userAgent: "Yeti",
      allow: ["/"],
    });
  }

  if (isGoogleSearchAllow === true) {
    rules.push({
      userAgent: "Googlebot",
      allow: ["/"],
    });
  }

  return {
    rules,
    sitemap: `${sitemap}/sitemap.xml`,
  };
}
