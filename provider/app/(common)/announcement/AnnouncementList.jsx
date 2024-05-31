import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getAnnouncementList() {
  const getannouncementsResponse = await fetchWithRetry(`/announcement`);

  if (!getannouncementsResponse.ok) return [];

  return await getannouncementsResponse.json();
}

export default async function AnnouncementList() {
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
