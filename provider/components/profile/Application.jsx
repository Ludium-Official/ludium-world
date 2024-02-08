import Link from "next/link";
import Icon from "../Icon";
import fetchWithRetry from "@/functions/api";
import { Fragment } from "react";

async function getApplicationList(usrId) {
  const getApplicationListResponse = await fetchWithRetry(
    `/profile/${usrId}/application`
  );

  if (!getApplicationListResponse.ok)
    if (getApplicationListResponse.status === 404) return [];
    else throw new Error("지원서를 조회하는 중 에러가 발생했습니다.");

  return await getApplicationListResponse.json();
}

export default async function Application({ usrId }) {
  const applications = await getApplicationList(usrId);

  console.log(applications);
  return (
    <div className="frame-34-6 background-white border-gray-06">
      <div className="frame-35-2">
        <h1 className="h4-20 color-black">나의 지원서</h1>
        {/* <Link className="frame-56-2 link" href="/">
          <p className="more color-gray-04">모두 보기</p>
          <div className="arrow-right">
            <div className="frame-78">
              <Icon
                src="/icon_arrow_right.svg"
                alt="more"
                width={12}
                height={12}
              />
            </div>
          </div>
        </Link> */}
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
