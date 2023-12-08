import fetchWithRetry from "../../../../../../functions/api";
import EditModuleContent from "./EditModuleContent";

export const metadata = {
  title: "모듈 수정"
}

async function getModule(announcementId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${moduleId}`
  );

  if (!getModuleResponse.ok) return null;

  return await getModuleResponse.json();
}

async function getArticle(moduleId) {
  const getAllMissionAndArticlesResponse = await fetchWithRetry(
    `/announcement/missionAndArticles/${moduleId}`
  );

  if (!getAllMissionAndArticlesResponse.ok) return [];

  return await getAllMissionAndArticlesResponse.json();
}

export default async function EditModulePage({
  params: { announcementId, moduleId },
}) {
  const module = await getModule(announcementId, moduleId);
  const articles = await getArticle(moduleId);

  return (
    <EditModuleContent
      module={module}
      articles={articles}
      announcementId={announcementId}
      moduleId={moduleId}
    />
  );
}
