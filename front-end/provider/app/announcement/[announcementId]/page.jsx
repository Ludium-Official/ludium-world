import ContentNavigation from "../../../components/ContentNavigation";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import announcementstyle from "../announcement.module.css";
import { ModuleViewer } from "./module/[moduleId]/page";
import BackButton from "../../../components/BackButton";
import ModuleNavigation from "../ModuleNavigation";
import Link from "next/link";

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
        <Link href="/announcement/apply">지원서 작성하기</Link>
      </ContentNavigation>
      <article className={announcementstyle.wrapper}>
        <h1 className={announcementstyle.title}>{announcement.title}</h1>
        <section className={announcementstyle["content-area"]}>
          <Viewer content={announcement.content} height="100%" />
        </section>
        <h2 className={announcementstyle["title-label"]}>모듈 목록</h2>
        <section
          className={`${announcementstyle["announcement-list"]} ${announcementstyle["module-list"]}`}
        >
          {announcement.modules.map((module) => (
            <article
              className={announcementstyle.module}
              key={crypto.randomUUID()}
            >
              <ModuleNavigation
                links={[{
                  href: `/announcement/apply`,
                  text: "지원서 작성하기",
                },
                  {
                    href: `/announcement/${announcementId}/module/${module.id}`,
                    text: "모듈보기",
                  },
                ]}
              />
              <ModuleViewer
                announcementId={announcementId}
                moduleId={module.id}
              />
            </article>
          ))}
        </section>
      </article>
    </>
  );
}
