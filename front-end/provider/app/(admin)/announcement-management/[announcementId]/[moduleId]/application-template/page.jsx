import fetchWithRetry from "@/functions/api";
import CreateApplicationTemplateForm from "./CreateApplicationTemplateForm";
import UpdateApplicationTemplateForm from "./UpdateApplicationTemplateForm";
import BackButton from "@/components/BackButton";

async function getApplicationTemplate(announcementId, detailId, role) {
  const getApplicationTemplateResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application-template?role=${role}`
  );

  if (!getApplicationTemplateResponse.ok) {
    return null;
  }

  return await getApplicationTemplateResponse.json();
}

async function ApplicationTemplate({ announcementId, moduleId, role }) {
  const applicationTemplate = await getApplicationTemplate(
    announcementId,
    moduleId,
    role
  );

  return (
    <>
      {applicationTemplate ? (
        <UpdateApplicationTemplateForm
          announcementId={announcementId}
          {...applicationTemplate}
        />
      ) : (
        <CreateApplicationTemplateForm
          announcementId={announcementId}
          detailId={moduleId}
          role={role}
        />
      )}
    </>
  );
}

export default async function ApplicationTemplatePage({
  params: { announcementId, moduleId },
  searchParams: { role },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">지원서 양식 작성</h3>
          </div>
        </div>
        <div className="frame-34-4">
          <div className="frame-117">
            <ApplicationTemplate
              announcementId={announcementId}
              moduleId={moduleId}
              role={role}
            />
          </div>
        </div>
      </article>
    </>
  );
}
