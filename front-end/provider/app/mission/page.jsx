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
    <p className="caption-12">
      [{learning.title}] {curriculum.title}
    </p>
  );
}

async function MissionList() {
  const missions = await getMissionList();

  console.log(missions);
  return (
    <div className="frame-34">
      <div className="frame-101">
        <div className="frame-9">
          <h2 className="h4-20 color-black">미션 목록</h2>
        </div>
      </div>
      {missions.map(({ missionId, title, curriculumId }) => (
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
            <div className="frame-102">
              <MissionParent curriculumId={curriculumId} />
            </div>
          </div>
        </Fragment>
      ))}
    </div>
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
          <h1 className="h3-24">미션 관리</h1>
          <MissionList />
        </div>
      </article>
    </>
  );
}
