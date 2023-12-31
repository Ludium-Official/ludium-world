import EditModuleContent from "@/app/announcement/[announcementId]/[moduleId]/edit/EditModuleContent";
import fetchWithRetry from "@/functions/api";

async function getDetailedAnnouncement(announcementId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${moduleId}`
  );

  if (!getModuleResponse.ok)
    throw new Error("세부 공고를 불러오는 중에 에러가 발생했습니다.");

  return await getModuleResponse.json();
}

export default async function ModulePage({
  params: { announcementId, moduleId },
}) {
  const detailedAnnouncement = await getDetailedAnnouncement(
    announcementId,
    moduleId
  );

  return <EditModuleContent module={detailedAnnouncement} />;
}
