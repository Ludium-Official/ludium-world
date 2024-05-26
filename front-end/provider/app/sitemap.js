export default function sitemap() {
  const siteMapUrl = process.env.NEXT_PUBLIC_SITE_MAP_URL;

  if (siteMapUrl === "" || siteMapUrl == null) return [];

  return [
    {
      url: `${siteMapUrl}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteMapUrl}/announcement`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteMapUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${siteMapUrl}/participation`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteMapUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
