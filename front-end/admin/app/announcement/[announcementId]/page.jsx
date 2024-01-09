import dynamic from "next/dynamic";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import DeleteButton from "@/components/DeleteButton";
import fetchWithRetry from "@/functions/api";
import announcementstyle from "../announcement.module.css";
import ModuleCreateButton from "./button/ModuleCreateButton";
import ModuleNavigation from "./ModuleNavigation";
import APPLY_CATEGORY from "@/enums/APPLY_CATEGORY";

const Viewer = dynamic(() => import("@/components/Viewer"), {
  ssr: false,
});

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
    <>
      <h2 className={announcementstyle["title-label"]}>작업 목록</h2>
      <ModuleCreateButton announceId={announcementId} />
      <section
        className={`${announcementstyle["announcement-list"]} ${announcementstyle["module-list"]}`}
      >
        {detailedAnnouncementList.map(({ detailId, title, description }) => (
          <details
            className={announcementstyle["detailed-announcement-wrapper"]}
            key={detailId}
            open={true}
          >
            <summary
              className={announcementstyle["detailed-announcement-summary"]}
            >
              {title === "" ? "작업" : title} 펼치기 / 닫기
            </summary>
            <ModuleNavigation links={[]}>
              {/* <ModuleDeleteButton
                announcementId={announcementId}
                moduleId={detailId}
              /> */}
              <Link
                href={`/announcement/${announcementId}/${detailId}/application?role=${APPLY_CATEGORY.PROVIDER}`}
              >
                작업 지원자 보기
              </Link>
              <Link
                href={`/announcement/${announcementId}/${detailId}/application-template?role=${APPLY_CATEGORY.PROVIDER}`}
              >
                작업자 지원서 양식 작성하기
              </Link>
              <Link href={`/announcement/${announcementId}/${detailId}`}>
                수정하기
              </Link>
            </ModuleNavigation>
            <div className={announcementstyle["detailed-announcement-title"]}>
              <input
                type="text"
                defaultValue={
                  title === ""
                    ? "수정하기 버튼을 눌러 작업 내용을 변경해주세요"
                    : title
                }
                readOnly
              />
            </div>
            <div
              className={
                announcementstyle["detailed-announcement-content-wrapper"]
              }
            >
              <Viewer content={description} />
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

async function AnnouncementContent({ announcementId }) {
  const announcement = await getAnnouncement(announcementId);

  return (
    <article className={announcementstyle.wrapper}>
      <h1 className={announcementstyle.title}>{announcement.title}</h1>
      <section className={announcementstyle["content-area"]}>
        <Viewer content={announcement.description} height="100%" />
      </section>
      <DetailedAnnouncementList announcementId={announcementId} />
    </article>
  );
}

export default async function AnnouncementPage({ params: { announcementId } }) {
  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
        {/* <DeleteButton deleteUrl={`/announcement/${announcementId}`} /> */}
        <Link href={`/announcement/${announcementId}/edit`}>수정하기</Link>
      </ContentNavigation>
      <AnnouncementContent announcementId={announcementId} />
    </>
  );
}
