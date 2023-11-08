import Link from "next/link";
import fetchWithRetry from "../../functions/api";

export async function getServerSideProps() {
  const getArticlesResponse = await fetchWithRetry(`/article`);

  if (!getArticlesResponse.ok) {
    return {
      props: {
        articles: []
      }
    }
  }

  return {
    props: {
      articles: await getArticlesResponse.json()
    }
  };
}

export default function Article({ articles }) {
  return <>
    <Link href="/article/new">글쓰기</Link>
    <h1>글 목록</h1>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {articles.map(article => (
        <Link key={article.id} href={`/article/${article.id}`}>{article.title}</Link>
      ))}
    </div>
  </>
}