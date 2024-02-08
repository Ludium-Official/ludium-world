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

export default async function MissionList({ usrId }) {
  const missions = await getMissionList(usrId);

  console.log(missions);
  return (
    <div className="frame-93-7">
      <div className="frame-57">
        <h1 className="h3-24 color-black">나의 미션</h1>
      </div>
      <div className="frame-58 background-white border-gray-06">
        <div className="frame-119">
          <div className="frame-123">
            <div className="frame-34-8">
              <div className="frame-9-6">
                <div className="frame-93-2">
                  <h2 className="h4-20 color-purple-01">제목</h2>
                </div>
              </div>
            </div>
            <div className="frame-101-3">
              <div className="frame-93-8">
                <h2 className="h4-20 color-purple-01">상태</h2>
              </div>
            </div>
          </div>
          <div className="line border-gray-04" />
          {missions.map((mission, index) => (
            <Fragment key={mission.missionId}>
              <div className="frame-118">
                <div className="frame-34-8">
                  <div className="frame-9-6">
                    <div className="frame-93-2">
                      <Link
                        className="link"
                        href={`/participation/${mission.postingId}/${mission.curriculumId}/mission/${mission.missionId}`}
                      >
                        <h2 className="h4-20 color-gray-02">{mission.title}</h2>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="frame-101-3">
                  <div
                    className={`frame-97 ${
                      mission.status === "APPROVE"
                        ? "background-purple-01"
                        : "background-purple-04"
                    }`}
                  >
                    <h2
                      className={`h4-20 ${
                        mission.status === "APPROVE"
                          ? "color-white"
                          : "color-purple-01"
                      }`}
                    >
                      {ko_kr[mission.status]}
                    </h2>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
