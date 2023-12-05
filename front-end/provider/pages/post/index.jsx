import Link from "next/link";
import fetchWithRetry from "../../functions/api";

export async function getServerSideProps() {
  const getPostsResponse = await fetchWithRetry(`/post`);

  if (!getPostsResponse.ok) {
    return {
      props: {
        posts: null
      }
    }
  }

  return {
    props: {
      posts: await getPostsResponse.json()
    }
  };
}

export default function Posts({ posts }) {

  return (
    <>
      <Link href="/post/new">글쓰기</Link>
      <h1>글 목록</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {posts.map(post => (
          <Link key={post.id} href={`/post/${post.id}`}>{post.title}</Link>
        ))}
      </div>
    </>
  )
}