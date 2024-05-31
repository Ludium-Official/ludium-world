import fetchWithRetry from "@/functions/api";
import EditAnnouncement from "./EditAnnouncement";

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

export default async function EditAnnouncementPage({
  params: { announcementId },
}) {
  const announcement = await getAnnouncement(announcementId);

  return <EditAnnouncement {...announcement} />;
}
