import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import { Fragment } from "react";

async function getMissionList() {
  const getMissionListResponse = await fetchWithRetry("/mission");

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션을 불러오는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
}

async function getCurriculum(curriculumId) {
  const getCurriculumResponse = await fetchWithRetry(
    `/curriculum/${curriculumId}`
  );

  if (!getCurriculumResponse.ok)
    throw new Error("커리큘럼을 불러오는 중 에러가 발생했습니다.");

  return await getCurriculumResponse.json();
}

async function getLearning(learningId) {
  const getLearningResponse = await fetchWithRetry(`/learning/${learningId}`);

  if (!getLearningResponse.ok)
    throw new Error("학습을 불러오는 중 에러가 발생했습니다.");

  return await getLearningResponse.json();
}

async function MissionParent({ curriculumId }) {
  const curriculum = await getCurriculum(curriculumId);
  const learning = await getLearning(curriculum.postingId);

  return (
    <>
      {learning.title} {">"} {curriculum.title}
    </>
  );
}

async function MissionList() {
  const missions = await getMissionList();
  const groupedMissions = missions.reduce((acc, cur) => {
    const { curriculumId } = cur;

    if (acc[curriculumId]) acc[curriculumId].push(cur);
    else acc[curriculumId] = [cur];

    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedMissions).map(([curriculumId, missions]) => (
        <div
          className="frame background-white border-gray-04"
          key={curriculumId}
        >
          <div className="frame-119">
            <div className="frame-123">
              <div className="frame-34-2">
                <div className="frame-9-2">
                  <div className="frame-93-2">
                    <h2 className="h4-20 color-purple-01">
                      <MissionParent curriculumId={curriculumId} />
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="line border-gray-02" />
          {missions
            .sort((a, b) => {
              if (a.orderNum > b.orderNum) return 1;

              if (a.orderNum < b.orderNum) return -1;

              return 0;
            })
            .map(({ missionId, title }) => (
              <Fragment key={missionId}>
                <div className="frame-136">
                  <div className="frame-35">
                    <div className="frame-92">
                      <div className="frame-3">
                        <Link
                          className="h5-18 color-gray-02 link"
                          href={`/mission/${missionId}`}
                        >
                          {title}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
        </div>
      ))}
    </>
  );
}

export default async function MissionListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <h3 className="h3-24">미션 목록</h3>
          <MissionList />
        </div>
      </article>
    </>
  );
}
