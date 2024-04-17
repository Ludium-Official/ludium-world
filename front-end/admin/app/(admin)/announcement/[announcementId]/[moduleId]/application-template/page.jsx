import fetchWithRetry from "@/functions/api";
import CreateApplicationTemplateForm from "./CreateApplicationTemplateForm";
import UpdateApplicationTemplateForm from "./UpdateApplicationTemplateForm";

async function getApplicationTemplate(announcementId, detailId, role) {
  const getApplicationTemplateResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application-template?role=${role}`
  );

  if (!getApplicationTemplateResponse.ok) {
    return null;
  }

  return await getApplicationTemplateResponse.json();
}

export default async function ApplicationTemplatePage({
  params: { announcementId, moduleId },
  searchParams: { role },
}) {
  const applicationTemplate = await getApplicationTemplate(
    announcementId,
    moduleId,
    role
  );

  if (!applicationTemplate)
    return (
      <CreateApplicationTemplateForm
        announcementId={announcementId}
        detailId={moduleId}
        role={role}
      />
    );

  return (
    <UpdateApplicationTemplateForm
      announcementId={announcementId}
      {...applicationTemplate}
    />
  );
}
