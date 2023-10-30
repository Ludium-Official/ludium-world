import Link from "next/link";
import { useEffect, useState } from "react";

export default function Article() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const getArticles = async () => {
      const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
      const getArticlesResponse = await fetch(`${serverUri}/article`);

      if (getArticlesResponse.ok) {
        setArticles(await getArticlesResponse.json());
      }
    }

    getArticles();
  }, [])

  return (
    <>
      <Link href="/article/new">글쓰기</Link>
      <h1>글 목록</h1>
      <div style={{display: "flex", flexDirection: "column"}}>
        {articles.map(article => (
          <Link key={article.id} href={`/article/${article.id}`}>{article.title}</Link>
        ))}
      </div>
    </>
  )
}