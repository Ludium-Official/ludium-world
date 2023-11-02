import Link from "next/link";

export default function Main() {
  return <>
    <article style={{ display: "flex", flexDirection: "column" }}>
      <Link href="/mission">미션</ Link>
      <Link href="/article">아티클</ Link>
      <Link href="/post">자유게시판</ Link>
      <Link href="/profile">프로필</Link>
    </article>
  </>
}