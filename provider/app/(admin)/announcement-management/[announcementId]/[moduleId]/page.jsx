import EditModuleContent from "@/app/(admin)/announcement-management/[announcementId]/[moduleId]/edit/EditModuleContent";
import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";

export async function generateMetadata({
  params: { announcementId, moduleId },
}) {
  const detailedAnnouncement = await getDetailedAnnouncement(
    announcementId,
    moduleId
  );

  return {
    title: detailedAnnouncement.title,
  };
}

async function getDetailedAnnouncement(announcementId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${moduleId}`
  );

  if (!getModuleResponse.ok)
    throw new Error("작업을 불러오는 중 에러가 발생했습니다.");

  return await getModuleResponse.json();
}

async function EditModule({ announcementId, moduleId }) {
  const detailedAnnouncement = await getDetailedAnnouncement(
    announcementId,
    moduleId
  );

  return <EditModuleContent module={detailedAnnouncement} />;
}

export default async function ModuleEditPage({
  params: { announcementId, moduleId },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">작업 수정</h3>
          </div>
          <div className="frame-34-4">
            <div className="frame-117">
              <EditModule announcementId={announcementId} moduleId={moduleId} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
