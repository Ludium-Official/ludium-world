import Icon from "@/components/Icon";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
  title: "루디움",
  description: "루디움: 웹 3.0 기반 플랫폼, 자유와 커뮤니티 중심, 데이터 주권",
  openGraph: {
    title: "루디움",
    description:
      "루디움: 웹 3.0 기반 플랫폼, 자유와 커뮤니티 중심, 데이터 주권",
    url: process.env.NEXT_PUBLIC_SITE_MAP_URL,
    siteName: "루디움",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "logo1.png",
        width: 70,
        height: 32,
        alt: "루디움",
      },
    ],
  },
};

const LatestAnnouncement = dynamic(
  () => import("@/components/LatestAnnouncement"),
  { loading: () => <p>최신 공고를 조회하는 중입니다...</p> }
);

const Top5AnnouncementList = dynamic(
  () => import("./(common)/home/Top5AnnouncementList"),
  { loading: () => <p>공고 목록을 조회하는 중입니다...</p> }
);

const Top5ParticipationList = dynamic(
  () => import("./(common)/home/Top5ParticipationList"),
  { loading: () => <p>학습 목록을 조회하는 중입니다...</p> }
);

async function getLatestBanner() {
  const getLatestBannerResponse = await fetchWithRetry(
    "/content/latest-banner"
  );

  if (!getLatestBannerResponse.ok)
    if (getLatestBannerResponse.status === 404) return null;
    else throw new Error("최신 배너를 조회하는 중 에러가 발생했습니다.");

  return await getLatestBannerResponse.json();
}

async function AnnouncementList() {
  return (
    <article className="article-list-wrapper">
      <header className="article-announce">
        <h2 className="article-list-text h3-24">공고 목록</h2>
        <Link className="article-list-more" href="/announcement">
          <p className="article-list-more-text p1-18">모두 보기</p>
          <div className="article-list-more-icon">
            <Icon
              src="/icon_arrow_right.svg"
              alt="모든 공고 목록 보기"
              width={12}
              height={12}
            />
          </div>
        </Link>
      </header>
      <ul className="article-list">
        <Top5AnnouncementList />
      </ul>
    </article>
  );
}

async function ParticipationList() {
  return (
    <article className="article-list-wrapper">
      <header className="article-announce">
        <h2 className="article-list-text h3-24">학습 목록</h2>
        <Link className="article-list-more" href="/participation">
          <p className="article-list-more-text p1-18">모두 보기</p>
          <div className="article-list-more-icon">
            <Icon
              src="/icon_arrow_right.svg"
              alt="모든 학습 목록 보기"
              width={12}
              height={12}
            />
          </div>
        </Link>
      </header>
      <ul className="article-list">
        <Top5ParticipationList />
      </ul>
    </article>
  );
}

async function LatestBanner() {
  const latestBanner = await getLatestBanner();

  if (latestBanner === null) {
    return (
      <div className="banner">
        <h2 className="h4-20 latest-announcement-text">
          최신 배너 데이터가 없습니다.
        </h2>
      </div>
    );
  }

  return (
    <div className="banner">
      {latestBanner.banner === "" ? null : (
        <Image
          className="banner-image"
          src={latestBanner.banner}
          alt={latestBanner.title}
          fill
        />
      )}
    </div>
  );
}

async function Content() {
  return (
    <article className="home-content">
      {/* <LatestBanner /> */}
      <div className="content-article">
        <AnnouncementList />
        <ParticipationList />
      </div>
    </article>
  );
}

export default async function Page() {
  return (
    <>
      <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_MAP_URL} />
      <LatestAnnouncement />
      <Content />
    </>
  );
}
