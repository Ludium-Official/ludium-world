import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";
import WorkContentCreateButton from "./WorkContentCreateButton";

const Viewer = dynamic(() => import("@/components/Viewer"), {
  ssr: false,
});

async function getWork(workId) {
  const getWorkResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}`
  );

  if (!getWorkResponse.ok)
    if (getWorkResponse.status === 404) throw new Error(404);
    else throw new Error(500);

  return await getWorkResponse.json();
}

async function getWorkContentList(workId) {
  const getWorkContentListResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/content`
  );

  if (!getWorkContentListResponse.ok)
    if (getWorkContentListResponse.status === 404) return [];
    else throw new Error(500);

  return await getWorkContentListResponse.json();
}

async function WorkContentList({ workId }) {
  const workContentList = await getWorkContentList(workId);

  return (
    <div className="frame-119">
      {workContentList.map((detailContent, index) => (
        <Fragment key={detailContent.detailContentId}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <Link
                  className="link"
                  href={`/work/${detailContent.detailId}/${detailContent.detailContentId}`}
                >
                  <h3 className="h4-20 color-gray-02">
                    {detailContent.title === ""
                      ? "작업물 제목을 입력해주세요"
                      : detailContent.title}
                  </h3>
                </Link>
              </div>
            </div>
          </div>
          {index < workContentList.length - 1 ? (
            <div className="line border-gray-06" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export default async function WorkPage({ params: { workId } }) {
  const work = await getWork(workId);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <div className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h1 className="h3-24 color-black">작업</h1>
          </div>
          <div className="frame background-white border-gray-06">
            <div className="frame-101">
              <div className="frame-9">
                <h2 className="h4-20 color-black">{work.title}</h2>
              </div>
            </div>
            <div className="line border-gray-05" />
            <div className="frame-120">
              <Viewer content={work.description} height="100%" />
            </div>
          </div>
        </div>
        <WorkContentCreateButton workId={workId} />
        <div className="frame background-white border-gray-06">
          <div className="frame-101">
            <div className="frame-9">
              <h2 className="h4-20 color-black">작업물 목록</h2>
            </div>
          </div>
          <WorkContentList workId={workId} />
        </div>
      </div>
    </>
  );
}
