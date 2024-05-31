import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import UserNick from "@/components/UserNick";
import APPLY_CATEGORY from "@/enums/APPLY_CATEGORY";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";
import PinAnnouncementButton from "./PinAnnouncementButton";
import ModuleCreateButton from "./button/ModuleCreateButton";

const Viewer = dynamic(() => import("@/components/Viewer"), {
  ssr: false,
});

export async function generateMetadata({ params: { announcementId } }) {
  const announcement = await getAnnouncement(announcementId);

  return {
    title: announcement.title,
  };
}

async function getAnnouncement(announcementId) {
  const getAnnouncementResponse = await fetchWithRetry(
    `/announcement/${announcementId}`
  );

  if (!getAnnouncementResponse.ok)
    throw new Error("공고를 불러오는 중 에러가 발생했습니다.");

  return await getAnnouncementResponse.json();
}

async function getDetailedAnnouncementList(announcementId) {
  const getDetailedAnnouncementListResponse = await fetchWithRetry(
    `/announcement/${announcementId}/detail`
  );

  if (!getDetailedAnnouncementListResponse.ok)
    throw new Error("작업을 불러오는 중 에러가 발생했습니다.");

  return await getDetailedAnnouncementListResponse.json();
}

async function getWorker(workId) {
  const getWorkerResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/worker`
  );

  if (!getWorkerResponse.ok)
    if (getWorkerResponse.status === 404) return null;
    else throw new Error(500);

  return await getWorkerResponse.json();
}

async function Worker({ detailId }) {
  const worker = await getWorker(detailId);

  if (worker === null)
    return <p className="caption-12 color-gray-04 worker">작업자: 없음</p>;

  return (
    <p className="caption-12 color-gray-04 worker">
      작업자: <UserNick usrId={worker.usrId} />
    </p>
  );
}

async function DetailedAnnouncementList({ announcementId }) {
  const detailedAnnouncements = await getDetailedAnnouncementList(
    announcementId
  );

  return (
    <section className="frame-119">
      {detailedAnnouncements.map(({ detailId, title, description }, index) => (
        <Fragment key={detailId}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <Link
                  className="link"
                  href={`/announcement-management/${announcementId}/${detailId}`}
                >
                  <h4 className="h4-20 color-gray-02">
                    {title === "" ? "작업 제목을 입력해주세요" : title}
                  </h4>
                </Link>
              </div>
            </div>
            <div className="frame-159">
              <Worker detailId={detailId} />
            </div>
            <div className="vertical-center">
              <Link
                href={`/announcement-management/${announcementId}/${detailId}/application?role=${APPLY_CATEGORY.PROVIDER}`}
              >
                지원자 보기
              </Link>
              <div className="margin1"></div>
              <Link
                href={`/announcement-management/${announcementId}/${detailId}/application-template?role=${APPLY_CATEGORY.PROVIDER}`}
              >
                지원서 양식 작성하기
              </Link>
            </div>
          </div>
          {index < detailedAnnouncements.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </section>
  );
}

export default async function AnnouncementPage({ params: { announcementId } }) {
  const announcement = await getAnnouncement(announcementId);

  return (
    <>
      <header className="nb">
        <BackButton />
        <Link
          className="frame-56 background-white border-none link"
          href={`/announcement-management/${announcementId}/edit`}
        >
          <Icon
            src="/icon_write.svg"
            alt="공고 수정하기"
            width={24}
            height={24}
          />
          <p className="h4-20 color-purple-01">수정하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">공고</h3>
            <PinAnnouncementButton
              announcementId={announcementId}
              isPinned={announcement.pinned}
            />
          </div>
          <div className="frame background-white border-gray-06">
            <div className="frame-101">
              <div className="frame-9">
                <h4 className="h4-20 color-black">{announcement.title}</h4>
              </div>
            </div>
            <div className="line border-gray-05" />
            <div className="frame-120">
              <Viewer content={announcement.description} height="100%" />
            </div>
          </div>
          <div className="frame background-white border-gray-06">
            <div className="frame-101">
              <div className="frame-9">
                <h4 className="h4-20 color-black">작업 목록</h4>
                <ModuleCreateButton announcementId={announcementId} />
              </div>
            </div>
            <DetailedAnnouncementList announcementId={announcementId} />
          </div>
        </div>
      </article>
    </>
  );
}
