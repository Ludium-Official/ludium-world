import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getTop5Announcement() {
  const getTop5AnnouncementResponse = await fetchWithRetry(
    "/announcement/top5"
  );

  if (!getTop5AnnouncementResponse.ok)
    if (getTop5AnnouncementResponse.status === 404) return [];
    else throw new Error("공고 목록을 조회하는 중 에러가 발생했습니다.");

  return await getTop5AnnouncementResponse.json();
}

export default async function Top5AnnouncementList() {
  const announcements = await getTop5Announcement();

  return (
    <>
      {announcements.map((announcement, index) => (
        <Fragment key={announcement.postingId}>
          <li className="article">
            {/* <div className="article-status">
          <p className="article-status-text caption-12 color-purple-01">
          마감 N일전
          </p>
        </div> */}
            <Link
              className="article-text h4-20"
              href={`/announcement/${announcement.postingId}`}
            >
              {announcement.title}
            </Link>
          </li>
          {index < announcements.length - 1 ? (
            <hr className="article-divider" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
