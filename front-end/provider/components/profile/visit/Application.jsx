import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getApplicationList(usrId) {
  const getApplicationListResponse = await fetchWithRetry(
    `/profile/${usrId}/application/top4`
  );

  if (!getApplicationListResponse.ok)
    if (getApplicationListResponse.status === 404) return [];
    else throw new Error("지원서를 조회하는 중 에러가 발생했습니다.");

  return await getApplicationListResponse.json();
}

export default async function Application({ usrId, nick }) {
  const applications = await getApplicationList(usrId);

  return (
    <div className="frame-34-6 background-white border-gray-06">
      <div className="frame-35-2">
        <h1 className="h4-20 color-black">{nick}의 지원서</h1>
      </div>
      {applications.map((application, index) => (
        <Fragment key={application.applicationId}>
          <div className="frame-44">
            <div className="frame-3 background-white border-purple-01">
              <p className="caption-12 color-purple-01">마감 미설정</p>
            </div>
            <Link
              className="h4-20 color-gray-02 link"
              href={`/announcement/${application.postingId}/${application.detailId}/apply/edit?role=${application.role}`}
            >
              {application.title}
            </Link>
          </div>
          {index < applications.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
