import BackButton from "@/components/BackButton";
import Link from "next/link";
import { Fragment } from "react";
import fetchWithRetry from "@/functions/api";

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

async function getAnnouncementList() {
  const getannouncementsResponse = await fetchWithRetry(`/announcement`);

  if (!getannouncementsResponse.ok) return [];

  return await getannouncementsResponse.json();
}

async function AnnouncementList() {
  const announcements = await getAnnouncementList();

  return (
    <div className="frame-119">
      {announcements.map(({ postingId, title }, index) => (
        <Fragment key={postingId}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <div className="frame-4-1 background-white border-purple-01">
                  <p className="caption-12 color-purple-01">마감 미설정</p>
                </div>
                <Link className="link" href={`/announcement/${postingId}`}>
                  <h2 className="h4-20 color-gray-02">{title}</h2>
                </Link>
              </div>
            </div>
          </div>
          {index < announcements.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

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
