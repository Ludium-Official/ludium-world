import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";
import ApplyForm from "./ApplyForm";
import RedirectEditPage from "./RedirectEditPage";
import BackButton from "@/components/BackButton";

export const metadata = {
  title: "지원서 작성하기",
};

export async function getApplicationTemplate(announcementId, detailId, role) {
  const getApplicationTemplateResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application-template?role=${role}`
  );

  if (!getApplicationTemplateResponse.ok)
    if (getApplicationTemplateResponse.status === 404) throw new Error(404);

  return await getApplicationTemplateResponse.json();
}

export async function getApplication(announcementId, detailId, role) {
  const cookieStore = cookies();

  if (cookieStore.get("access_token") === undefined) throw new Error(401);

  const submitApplyResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application/submit?role=${role}`,
    {
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!submitApplyResponse.ok)
    if (submitApplyResponse.status === 403) throw new Error(403);
    else if (submitApplyResponse.status === 404) return null;
    else return null;

  return await submitApplyResponse.json();
}

export default async function ApplyPage({
  params: { announcementId, moduleId },
  searchParams: { role },
}) {
  const applicationTemplate = await getApplicationTemplate(
    announcementId,
    moduleId,
    role
  );

  const submit = await getApplication(announcementId, moduleId, role);

  if (submit)
    return (
      <RedirectEditPage
        announcementId={announcementId}
        moduleId={moduleId}
        role={role}
      />
    );

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <ApplyForm
        announcementId={announcementId}
        detailId={moduleId}
        applicationTemplate={applicationTemplate}
      />
    </>
  );
}
