import Link from "next/link";
import fetchWithRetry from "../../functions/api";
import articlestyle from "./article.module.css";
import ContentNavigation from "../../components/ContentNavigation";

export const metadata = {
  title: "아티클"
}

async function getArticleList() {
  const getCoursesResponse = await fetchWithRetry(`/article`);

  if (!getCoursesResponse.ok) return [];

  return await getCoursesResponse.json();
}

export default async function ArticlePage() {
  const articles = await getArticleList();
  const articleLinks = [
    {
      href: "/article/new",
      text: "아티클 추가",
    },
  ];

  return (
    <>
      <div className={articlestyle["content-navigation"]}>
        <ContentNavigation links={articleLinks} />
      </div>
      <article className={articlestyle.wrapper}>
        <h1 className={articlestyle["title-label"]}>아티클 목록</h1>
        <div className={articlestyle["article-list"]}>
          {articles.map((article) => (
            <h2 className={articlestyle["article-list-item"]} key={crypto.randomUUID()}>
              <Link key={article.id} href={`/article/${article.id}`}>
                {article.title}
              </Link>
            </h2>
          ))}
        </div>
      </article>
    </>
  );
}
