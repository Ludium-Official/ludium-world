import ContentNavigation from "../../../../../components/ContentNavigation";
import Viewer from "../../../../../components/Viewer";
import fetchWithRetry from "../../../../../functions/api";
import announcementstyle from "../../../announcement.module.css";

export async function getModule(announcementId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${moduleId}`
  );

  return await getModuleResponse.json();
}

export async function ModuleViewer({announcementId, moduleId}) {
  const module = await getModule(announcementId, moduleId);

  return <>
    <div className={announcementstyle["module-header-area"]}>
      <input type="text" defaultValue={module.title} readOnly />
    </div>
    <hr />
    <div style={{ border: "1px solid", minHeight: "626px" }}>
      <Viewer content={module.content} />
    </div>
  </>;
}

export default async function ModulePage({ params: { announcementId, moduleId } }) {
  const links = [{
    href: `/announcement/${announcementId}`,
    text: "돌아가기"
  }, {
    href: `/announcement/${announcementId}/module/${moduleId}/edit`,
    text: "수정하기",
  },
  ];

  return (
    <>
      <ContentNavigation links={links}></ContentNavigation>
      <article className={announcementstyle.wrapper}>
        <ModuleViewer announcementId={announcementId} moduleId={moduleId} />
      </article>
    </>
  );
}
