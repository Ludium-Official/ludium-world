import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="home-content">
      <h2 className="h3-24 color-gray-01">페이지를 찾을 수 없습니다.</h2>
      <p className="caption-12">요청한 자료를 찾을 수 없습니다.</p>
      <Link className="link" href="/">
        <h3 className="h4-20 color-black">홈 화면으로 이동</h3>
      </Link>
    </section>
  );
}
