import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import APPLY_CATEGORY from "@/enums/APPLY_CATEGORY";
import fetchWithRetry from "@/functions/api";
import { getDate } from "@/functions/helper";
import dynamic from "next/dynamic";
import Link from "next/link";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getDetailedAnnouncement(announcementId, detailedAnnouncement) {
  const getMakeResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailedAnnouncement}`
  );

  if (!getMakeResponse.ok) return [];

  return await getMakeResponse.json();
}

export async function DetailedAnnouncement({ announcementId, moduleId }) {
  const detailedAnnouncement = await getDetailedAnnouncement(
    announcementId,
    moduleId
  );

  return (
    <div className="frame-151">
      <div className="frame-149">
        <div className="frame background-white border-gray-06">
          <div className="frame-101">
            <div className="frame-9">
              <div className="frame-145">
                <h1 className="h4-20 color-black">
                  {detailedAnnouncement.title}
                </h1>
              </div>
              <div className="frame-9-3">
                <p className="caption-12 color-gray-04">
                  작성일: {getDate(detailedAnnouncement.createAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="frame background-white border-gray-06">
          <div className="frame-120">
            <Viewer content={detailedAnnouncement.description} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DetailedAnnouncementPage({
  params: { announcementId, moduleId },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
        <Link
          className="frame-56 link"
          href={`/announcement/${announcementId}/${moduleId}/apply?role=${APPLY_CATEGORY.PROVIDER}`}
        >
          <Icon src="/icon_plus.svg" alt="추가하기" width={24} height={24} />
          <p className="h4-20 color-purple-01">지원하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <DetailedAnnouncement
          announcementId={announcementId}
          moduleId={moduleId}
        />
      </article>
    </>
  );
}
