import Icon from "@/components/Icon";
import LatestAnnouncement from "@/components/LatestAnnouncement";
import Link from "next/link";

export const metadata = {
  title: "루디움",
  description:
    "이곳에서는 루디움, 루디움의 공지사항 그리고 전반적인 Web3.0에 대한 정보들을 찾아 볼 수 있어.",
};

async function Content() {
  return (
    <article className="home-content">
      <div className="banner">
        <h1 style={{ textAlign: "center" }}>배너 영역 준비중...</h1>
      </div>
      <div className="content-article">
        <article className="article-list-wrapper">
          <header className="article-announce">
            <h1 className="article-list-text h3-24">공고 목록</h1>
            <Link className="article-list-more" href="/announcement">
              <p className="article-list-more-text p1-18">모두 보기</p>
              <div className="article-list-more-icon">
                <Icon
                  src="icon_arrow_right.svg"
                  alt="more"
                  width={12}
                  height={12}
                />
              </div>
            </Link>
          </header>
          <main className="article-list">
            <section className="article">
              <div className="article-status">
                <p className="article-status-text caption-12 color-purple-01">
                  마감 3일전
                </p>
              </div>
              <p className="article-text h4-20">
                데이터 전문가를 위한 실용적인 도커 : 머신러닝을 위한...
              </p>
            </section>
            <div className="article-divider" />
          </main>
        </article>
        <article className="article-list-wrapper">
          <header className="article-announce">
            <h1 className="article-list-text h3-24">학습 목록</h1>
            <Link className="article-list-more" href="/participation">
              <p className="article-list-more-text p1-18">모두 보기</p>
              <div className="article-list-more-icon">
                <Icon
                  src="icon_arrow_right.svg"
                  alt="more"
                  width={12}
                  height={12}
                />
              </div>
            </Link>
          </header>
          <main className="article-list">
            <section className="article">
              <div className="article-status">
                <p className="article-status-text caption-12 color-purple-01">
                  수강기한 31일
                </p>
              </div>
              <p className="article-text h4-20">
                데이터 전문가를 위한 실용적인 도커 : 머신러닝을 위한...
              </p>
            </section>
            <div className="article-divider" />
          </main>
        </article>
      </div>
    </article>
  );
}

export default async function Page() {
  return (
    <>
      <LatestAnnouncement />
      <Content />
    </>
  );
}
