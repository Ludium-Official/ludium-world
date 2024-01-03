import APPLY_CATEGORY from "@/enums/APPLY_CATEGORY";
import BackButton from "../../../components/BackButton";
import ContentNavigation from "../../../components/ContentNavigation";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import ModuleNavigation from "../ModuleNavigation";
import announcementstyle from "../announcement.module.css";
// import RedirectApply from "./RedirectApply";

export async function generateMetadata({ params: { announcementId } }) {
  const announcement = await getAnnouncement(announcementId);

  return {
    title: announcement.title,
  };
}
export async function getAnnouncement(announcementId) {
  const getAnnouncementResponse = await fetchWithRetry(
    `/announcement/${announcementId}`
  );

  if (!getAnnouncementResponse.ok)
    throw new Error("공고를 불러오는 중 에러가 발생했습니다.");

  return await getAnnouncementResponse.json();
}

async function getDetailedAnnouncementList(announcementId) {
  const getDetailedAnnouncementListResponse = await fetchWithRetry(
    `/announcement/${announcementId}/detail`
  );

  if (!getDetailedAnnouncementListResponse.ok)
    throw new Error("작업을 불러오는 중 에러가 발생했습니다.");

  return await getDetailedAnnouncementListResponse.json();
}

async function DetailedAnnouncementList({ announcementId }) {
  const detailedAnnouncementList = await getDetailedAnnouncementList(
    announcementId
  );

  return (
    <section
      className={`${announcementstyle["announcement-list"]} ${announcementstyle["module-list"]}`}
    >
      {detailedAnnouncementList.map(({ detailId, title, description }) => (
        <article key={detailId}>
          <ModuleNavigation
            links={[
              {
                href: `/announcement/${announcementId}/${detailId}/apply?role=${APPLY_CATEGORY.PROVIDER}`,
                text: "지원서 작성하기",
              },
            ]}
          />
          <details className={announcementstyle.module} open={true}>
            <summary>{title === "" ? "작업" : title} 펼치기 / 닫기</summary>
            <div className={announcementstyle["module-header-area"]}>
              <input
                type="text"
                defaultValue={
                  title === ""
                    ? "작업의 내용이 아직 작성되지 않았습니다."
                    : title
                }
                readOnly
              />
            </div>
            <div className={announcementstyle["module-content"]}>
              <Viewer content={description} />
            </div>
          </details>
        </article>
      ))}
    </section>
  );
}

export default async function AnnouncementPage({ params: { announcementId } }) {
  const announcement = await getAnnouncement(announcementId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <article className={announcementstyle.wrapper}>
        {/* <RedirectApply
          modules={announcement.modules}
          announcementId={announcementId}
        /> */}
        <h1 className={announcementstyle.title}>{announcement.title}</h1>
        <section className={announcementstyle["content-area"]}>
          <Viewer content={announcement.description} height="100%" />
        </section>
        <h2 className={announcementstyle["title-label"]}>작업 목록</h2>
        <DetailedAnnouncementList announcementId={announcementId} />
      </article>
    </>
  );
}
