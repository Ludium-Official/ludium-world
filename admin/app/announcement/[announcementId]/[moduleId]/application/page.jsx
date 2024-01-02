import announcementstyle from "@/app/announcement/announcement.module.css";
import fetchWithRetry from "@/functions/api";
import ApplicationList from "./ApplicationList";

async function getApplicationTemplate(announcementId, detailId, role) {
  const getApplicationTemplateResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application-template?role=${role}`
  );

  if (!getApplicationTemplateResponse.ok) {
    return null;
  }

  return await getApplicationTemplateResponse.json();
}

async function getApplicationList(announcementId, detailId, role) {
  const getApplicationResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application?role=${role}`
  );

  if (!getApplicationResponse.ok)
    throw new Error("지원자 목록을 가져오는 중 에러가 발생했습니다. ");

  return await getApplicationResponse.json();
}

async function getApplicationWorker(announcementId, detailId, role) {
  const getWorkerResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/worker?role=${role}`
  );

  if (!getWorkerResponse.ok)
    switch (getWorkerResponse.status) {
      case 404:
        return null;
      case 500:
        throw new Error("작업자 정보를 가져오는 중 에러가 발생했습니다. ");
    }

  return await getWorkerResponse.json();
}

async function DetailedAnnouncementWorker({ announcementId, detailId, role }) {
  const worker = await getApplicationWorker(announcementId, detailId, role);

  const { nick } = worker ? worker : { nick: null };

  return <h2>작업자: {nick ?? "없음"}</h2>;
}

export default async function ApplicationPage({
  params: { announcementId, moduleId },
  searchParams: { role },
}) {
  const applicationTemplate = await getApplicationTemplate(
    announcementId,
    moduleId,
    role
  );

  if (!applicationTemplate)
    throw new Error(
      "제작자 지원서 양식이 없습니다. 지원서 양식을 먼저 만들어주세요."
    );

  const applicationList = await getApplicationList(
    announcementId,
    moduleId,
    role
  );

  return (
    <article className={announcementstyle.wrapper}>
      <h1>지원서 수: {applicationList.length}개</h1>
      <DetailedAnnouncementWorker
        announcementId={announcementId}
        detailId={moduleId}
        role={role}
      />
      <ApplicationList
        announcementId={announcementId}
        applicationList={applicationList}
      />
    </article>
  );
}
