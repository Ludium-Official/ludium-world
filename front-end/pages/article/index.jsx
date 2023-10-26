import Link from "next/link";

export default function Article() {

  return (
    <>
      <Link href="/article/new">글쓰기</Link>
      <div>글 목록 표시</div>
    </>
  )
}