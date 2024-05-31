import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import DeleteWorkerButton from "./DeleteWorkerButtons";
import { Fragment } from "react";
import dynamic from "next/dynamic";
import AllocateWorker from "./AllocateWorker";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

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

async function ApplicationList({ announcementId, applications }) {
  return (
    <div className="frame-119">
      {applications.map(
        (
          { applicationId, nick, description, detailId, usrId, role },
          index
        ) => (
          <Fragment key={applicationId}>
            <div className="margin1" />
            <div className="frame-118">
              <div class="frame background-white border-gray-06">
                <div class="frame-101">
                  <div class="frame-9">
                    <h2 class="h4-20 color-black">{nick}</h2>
                    <div className="flex-end">
                      <AllocateWorker
                        announcementId={announcementId}
                        detailId={detailId}
                        usrId={usrId}
                        role={role}
                      />
                    </div>
                  </div>
                </div>
                <div class="line border-gray-05" />
                <div class="frame-120">
                  <Viewer content={description} height="100%" />
                </div>
              </div>
            </div>
            <div className="margin1" />
            {index < applications.length - 1 ? (
              <div className="line border-gray-05" />
            ) : null}
          </Fragment>
        )
      )}
    </div>
  );
}

async function DetailedAnnouncementWorker({ announcementId, detailId, role }) {
  const worker = await getApplicationWorker(announcementId, detailId, role);
  const { nick } = worker ? worker : { nick: null };

  return (
    <>
      <p className="caption-12">(작업자: {nick ?? "없음"})</p>
      {worker ? (
        <DeleteWorkerButton announcementId={announcementId} worker={worker} />
      ) : null}
    </>
  );
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
      "작업자 지원서 양식이 없습니다. 지원서 양식을 먼저 만들어주세요."
    );

  const applications = await getApplicationList(announcementId, moduleId, role);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">
              지원서 수: {applications.length}개
            </h3>
            <DetailedAnnouncementWorker
              announcementId={announcementId}
              detailId={moduleId}
              role={role}
            />
          </div>
          <div className="frame-34">
            <ApplicationList
              announcementId={announcementId}
              applications={applications}
            />
          </div>
        </div>
      </article>
    </>
  );
}
