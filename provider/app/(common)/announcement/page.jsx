import BackButton from "@/components/BackButton";
import dynamic from "next/dynamic";

const AnnouncementList = dynamic(() => import("./AnnouncementList"), {
  loading: () => <p>공고를 조회하는 중입니다...</p>,
});

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
  title: "웹 3.0 프로젝트 공고",
  description: "웹 3.0 프로젝트 최신 공고 및 기회를 확인하세요.",
  openGraph: {
    title: "웹 3.0 프로젝트 공고",
    description: "웹 3.0 프로젝트 최신 공고 및 기회를 확인하세요.",
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

export default async function AnnouncementPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93-7">
          <div className="frame-57">
            <h1 className="h3-24 color-black">공고 목록</h1>
          </div>
          <div className="frame-34">
            <AnnouncementList />
          </div>
        </div>
      </article>
    </>
  );
}
