export default function robots() {
  const rules = [];
  const isNaverSearchAllow =
    process.env.NEXT_PUBLIC_NAVER_SEARCH_ADVISOR !== "" &&
    process.env.NEXT_PUBLIC_NAVER_SEARCH_ADVISOR != null;

  if (isNaverSearchAllow === true) {
    rules.push({
      userAgent: "Yeti",
      allow: ["/"],
    });
  }

  return {
    rules,
  };
}
