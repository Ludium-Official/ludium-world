import fetchWithRetry from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import Link from "next/link";
import { Fragment } from "react";

async function getMissionList(usrId) {
  const getMissionListResponse = await fetchWithRetry(
    `/profile/${usrId}/mission`
  );

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
}

export default async function Mission({ usrId }) {
  const missions = await getMissionList(usrId);

  return (
    // <div className="frame-44-2">
    <div className="frame-34-6 background-white border-gray-06">
      {/* <div className="frame-34-7 background-white border-gray-06"> */}
      <div className="frame-35-2">
        <h1 className="h4-20 color-black">나의 미션</h1>
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
      {missions.map((mission, index) => (
        <Fragment key={mission.missionId}>
          <div className="frame-40">
            <div className="frame-3 background-white border-purple-01">
              <p className="caption-12 color-purple-01">
                {ko_kr[mission.status]}
              </p>
            </div>
            <Link
              className="link"
              href={`/participation/${mission.postingId}/${mission.curriculumId}/mission/${mission.missionId}`}
            >
              <h2 className="h4-20 color-gray-02">{mission.title}</h2>
            </Link>
          </div>
          {index < missions.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
    // </div>
  );
}
