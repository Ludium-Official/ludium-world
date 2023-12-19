import dynamic from "next/dynamic";
import ContentNavigation from "../../../../../components/ContentNavigation";
import fetchWithRetry from "../../../../../functions/api";
import announcementstyle from "../../../announcement.module.css";
import MakeCreateButton from "./MakeCreateButton";
const Viewer = dynamic(()=> import("../../../../../components/Viewer"), {ssr: false});

async function getModule(announcementId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${moduleId}`
  );

  return await getModuleResponse.json();
}

async function getMake(announcementId, moduleId) {
  const getMakeResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${moduleId}/make`
  );

  if(!getMakeResponse.ok) return [];

  return await getMakeResponse.json();
}

export async function ModuleViewer({ announcementId, moduleId }) {
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
  const makes = await getMake(announcementId, moduleId);

  const links = [{
    href: `/announcement/${announcementId}`,
    text: "돌아가기"
  }, {
    href: `/announcement/${announcementId}/module/${moduleId}/edit`,
    text: "수정하기",
  }];

  return (
    <>
      <ContentNavigation links={links}></ContentNavigation>
      <article className={announcementstyle.wrapper}>
        <ModuleViewer announcementId={announcementId} moduleId={moduleId} />
        <MakeCreateButton announcementId={announcementId} moduleId={moduleId} />
        {
          makes.map((make) =>
            <section key={crypto.randomUUID()}>
              <ContentNavigation links={[{
                href: `/announcement/${announcementId}/module/${moduleId}/make/${make.id}/edit`,
                text: "수정하기"
              }, {
                href: `/make/${make.id}/edit`,
                text: "제작하기"
              }, {
                href: `/validate/${make.id}`,
                text: "검증하기"
              }]} />
              <h2>{make.title}</h2>
            </section>
          )
        }
      </article>
    </>
  );
}
