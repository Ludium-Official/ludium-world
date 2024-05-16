import fetchWithRetry from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import Link from "next/link";
import { Fragment } from "react";

async function getMissionList(usrId) {
  const getMissionListResponse = await fetchWithRetry(
    `/profile/${usrId}/mission/top4`
  );

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
}

export default async function Mission({ usrId }) {
  const missions = await getMissionList(usrId);

  return (
    <>
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
    </>
  );
}
