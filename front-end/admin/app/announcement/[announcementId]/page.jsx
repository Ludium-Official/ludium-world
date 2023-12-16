import dynamic from "next/dynamic";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import ContentNavigation from "../../../components/ContentNavigation";
import DeleteButton from "../../../components/DeleteButton";
import fetchWithRetry from "../../../functions/api";
import announcementstyle from "../announcement.module.css";
import ModuleCreateButton from "./ModuleCreateButton";
import ModuleNavigation from "./ModuleNavigation";
import { ModuleViewer } from "./module/[moduleId]/page";
import ModuleDeleteButton from "./ModuleDeleteButton";
import ModuleOrderNoForm from "./ModuleOrderNoForm";

const Viewer = dynamic(() => import("../../../components/Viewer"), {
  ssr: false,
});

export const metadata = {
  title: "공고",
};

export async function getAnnouncement(announcementId) {
  const getAnnouncementResponse = await fetchWithRetry(
    `/announcement/${announcementId}`
  );

  if (!getAnnouncementResponse.ok) return null;

  return await getAnnouncementResponse.json();
}

export default async function AnnouncementPage({ params: { announcementId } }) {
  const announcement = await getAnnouncement(announcementId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
        <DeleteButton deleteUrl={`/announcement/${announcementId}`} />
        <Link href={`/announcement/${announcementId}/edit`}>수정하기</Link>
      </ContentNavigation>
      <article className={announcementstyle.wrapper}>
        <h1 className={announcementstyle.title}>{announcement.title}</h1>
        <section className={announcementstyle["content-area"]}>
          <Viewer content={announcement.content} height="100%" />
        </section>
        <h2 className={announcementstyle["title-label"]}>모듈 목록</h2>
        <ModuleCreateButton announceId={announcementId} />
        <section
          className={`${announcementstyle["announcement-list"]} ${announcementstyle["module-list"]}`}
        >
          {announcement.modules.map((module) => (
            <div key={crypto.randomUUID()}>
              <ModuleOrderNoForm moduleId={module.id} orderNo={module.orderNo} />
              <ModuleNavigation links={[]}>
                <ModuleDeleteButton
                  announcementId={announcementId}
                  moduleId={module.id}
                />
                <Link href={`/announcement/${announcementId}/module/${module.id}/apply`}>
                  지원서 작성하기
                </Link>
                <Link
                  href={`/announcement/${announcementId}/module/${module.id}`}
                >
                  모듈보기
                </Link>
              </ModuleNavigation>
              <ModuleViewer
                announcementId={announcementId}
                moduleId={module.id}
              />
            </div>
          ))}
        </section>
      </article>
    </>
  );
}
