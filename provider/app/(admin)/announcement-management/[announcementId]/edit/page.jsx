import fetchWithRetry from "@/functions/api";
import EditAnnouncementContent from "./EditAnnouncementContent";
import BackButton from "@/components/BackButton";

export async function generateMetadata({ params: { announcementId } }) {
  const announcement = await getAnnouncement(announcementId);

  return {
    title: announcement.title,
  };
}
async function getAnnouncement(announcementId) {
  const getAnnouncementResponse = await fetchWithRetry(
    `/announcement/${announcementId}`
  );

  if (!getAnnouncementResponse.ok)
    throw new Error("공고를 불러오는 중 에러가 발생했습니다.");

  return await getAnnouncementResponse.json();
}

async function EditAnnouncement({ announcementId }) {
  const announcement = await getAnnouncement(announcementId);

  return <EditAnnouncementContent {...announcement} />;
}

export default async function EditAnnouncementPage({
  params: { announcementId },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">공고 수정</h3>
          </div>
        </div>
        <div className="frame-34-4">
          <div className="frame-117">
            <EditAnnouncement announcementId={announcementId} />
          </div>
        </div>
      </article>
    </>
  );
}
