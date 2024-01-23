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
      <EditApplyForm
        announcementId={announcementId}
        detailId={moduleId}
        application={application}
      />
    </>
  );
}
