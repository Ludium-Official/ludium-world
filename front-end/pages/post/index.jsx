import Link from "next/link";
import { useEffect, useState } from "react";

export default function Post() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
      const getPostsResponse = await fetch(`${serverUri}/post`);

      if (getPostsResponse.ok) {
        setPosts(await getPostsResponse.json());
      }
    }

    getPosts();
  }, [])

  return (
    <>
      <Link href="/post/new">글쓰기</Link>
      <h1>글 목록</h1>
      <div style={{display: "flex", flexDirection: "column"}}>
        {posts.map(post => (
          <Link key={post.id} href={`/post/${post.id}`}>{post.title}</Link>
        ))}
      </div>
    </>
  )
}