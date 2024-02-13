import BackButton from "@/components/BackButton";
import { getApplication } from "../page";
import EditApplyForm from "./EditApplyForm";

export default async function EditApply({
  params: { announcementId, moduleId },
  searchParams: { role },
}) {
  const application = await getApplication(announcementId, moduleId, role);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h1 className="h3-24 color-black">지원서 작성</h1>
          </div>
          <div className="frame-34-4 background-white border-gray-06">
            <div className="frame-117">
              <EditApplyForm
                announcementId={announcementId}
                detailId={moduleId}
                application={application}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
