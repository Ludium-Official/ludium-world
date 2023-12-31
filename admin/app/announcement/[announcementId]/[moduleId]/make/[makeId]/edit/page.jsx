import fetchWithRetry from "../../../../../../../../functions/api";
import EditMakeContent from "./EditModuleContent";

export const metadata = {
  title: "제작 수정"
}

async function getModule(moduleId, makeId) {
  const getModuleResponse = await fetchWithRetry(
    `/announcement/${moduleId}/${makeId}`
  );

  if (!getModuleResponse.ok) return null;

  return await getModuleResponse.json();
}

export default async function EditMakePage({
  params: { announcementId, moduleId, makeId },
}) {
  const module = await getModule(moduleId, makeId);

  return (
    <EditMakeContent
      announcementId={announcementId}
      module={module}
      moduleId={moduleId}
      makeId={makeId}
    />
  );
}
