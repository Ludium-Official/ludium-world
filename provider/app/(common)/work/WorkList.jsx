import fetchWithRetry from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";

const UserNick = dynamic(() => import("@/components/UserNick"), {
  loading: () => <>작업자를 불러오는 중입니다...</>,
});

async function getWorkList() {
  const getWorkResponse = await fetchWithRetry("/detailed-announcement");

  if (!getWorkResponse.ok)
    if (getWorkResponse.status === 404) return [];
    else throw new Error("작업 목록을 조회하는 중 에러가 발생했습니다.");

  return await getWorkResponse.json();
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

async function Worker({ workId }) {
  const worker = await getWorker(workId);

  if (worker === null)
    return <p className="caption-12 color-gray-04 worker">작업자: 없음</p>;

  return (
    <p className="caption-12 color-gray-04 worker">
      작업자: <UserNick usrId={worker.usrId} />
    </p>
  );
}

export default async function WorkList() {
  const works = await getWorkList();

  return (
    <div className="frame-119">
      {works.map(({ detailId, title, status }, index) => (
        <Fragment key={detailId}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <div className="frame-4-1 background-white border-purple-01">
                  <p className="caption-12 color-purple-01">{ko_kr[status]}</p>
                </div>
                <Link className="link" href={`/work/${detailId}`}>
                  <h2 className="h4-20 color-gray-02">{title}</h2>
                </Link>
              </div>
            </div>
            <div className="frame-159">
              <Worker workId={detailId} />
            </div>
          </div>
          {index < works.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
