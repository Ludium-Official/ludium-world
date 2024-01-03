import BackButton from "../../../../../components/BackButton";
import ContentNavigation from "../../../../../components/ContentNavigation";
import Viewer from "../../../../../components/Viewer";
import fetchWithRetry from "../../../../../functions/api";
import ModuleNavigation from "../../../ModuleNavigation";
import announcementstyle from "../../../announcement.module.css";

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

  if (!getMakeResponse.ok) return [];

  return await getMakeResponse.json();
}

export async function ModuleViewer({ announcementId, moduleId }) {
  const module = await getModule(announcementId, moduleId);

  return (
    <>
      <div className={announcementstyle["module-header-area"]}>
        <input type="text" defaultValue={module.title} readOnly />
      </div>
      <div className={announcementstyle["module-content"]}>
        <Viewer content={module.description} />
      </div>
    </>
  );
}

export default async function ModulePage({
  params: { announcementId, moduleId },
}) {
  const makes = await getMake(announcementId, moduleId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <article className={announcementstyle.wrapper}>
        <ModuleViewer announcementId={announcementId} moduleId={moduleId} />
        <h2>제작 목록</h2>
        {makes.map((make) => (
          <section
            className={announcementstyle["make-wrapper"]}
            key={crypto.randomUUID()}
          >
            <ModuleNavigation
              links={[
                {
                  href: `/make/${make.id}/edit`,
                  text: "제작하기",
                },
                {
                  href: `/validate/${make.id}`,
                  text: "검증하기",
                },
              ]}
            />
            <h3 className={announcementstyle["make-title"]}>{make.title}</h3>
          </section>
        ))}
      </article>
    </>
  );
}
