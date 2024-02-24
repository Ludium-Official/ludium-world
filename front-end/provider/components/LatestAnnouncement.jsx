import Link from "next/link";
import Icon from "./Icon";
import fetchWithRetry from "@/functions/api";

async function getLatestAnnouncement() {
  const getLatestAnnouncementResponse = await fetchWithRetry(
    "/content/latest-announcement"
  );

  if (!getLatestAnnouncementResponse.ok)
    if (getLatestAnnouncementResponse.status === 404) return null;
    else throw new Error("최신 공지사항을 조회하는 중 에러가 발생했습니다.");

  return await getLatestAnnouncementResponse.json();
}

export default async function LatestAnnouncement() {
  const latestAnnouncement = await getLatestAnnouncement();

  return (
    <header className="latest-announcement-wrapper">
      <Link
        className="latest-announcement"
        href={
          latestAnnouncement == null
            ? "/"
            : `/community/${latestAnnouncement.contentId}`
        }
      >
        <Icon
          src="/icon_announce.svg"
          alt="최신 공지사항 보러가기"
          width={24}
          height={24}
        />
        <h1 className="h4-20 latest-announcement-text">
          {latestAnnouncement == null
            ? "최신 공지 데이터가 없습니다."
            : latestAnnouncement.title}
        </h1>
        <p className="latest-announcement-icon">N</p>
      </Link>
    </header>
  );
}
