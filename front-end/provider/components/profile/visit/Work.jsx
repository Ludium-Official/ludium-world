import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getWorkList(usrId) {
  const getWorkListResponse = await fetchWithRetry(
    `/profile/${usrId}/detailed-announcement/top4`
  );

  if (!getWorkListResponse.ok)
    if (getWorkListResponse.status === 404) return [];
    else throw new Error("작업을 조회하는 중 에러가 발생했습니다.");

  return await getWorkListResponse.json();
}

export default async function Work({ usrId, nick }) {
  const works = await getWorkList(usrId);

  return (
    <div className="frame-34-6 background-white border-gray-06">
      <div className="frame-35-2">
        <h1 className="h4-20 color-black">{nick}의 작업</h1>
      </div>
      {works.map((work, index) => (
        <Fragment key={work.detailId}>
          <div className="frame-44">
            <div className="frame-3 background-white border-purple-01">
              <p className="caption-12 color-purple-01">마감 미설정</p>
            </div>
            <Link
              className="h4-20 color-gray-02 link"
              href={`/work/${work.detailId}`}
            >
              {work.title}
            </Link>
          </div>
          {index < works.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
