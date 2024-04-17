import fetchWithRetry from "@/functions/api";
import Link from "next/link";

export const metadata = {
  title: "미션관리",
};

async function getMissionList() {
  const getMissionListResponse = await fetchWithRetry(`/mission`);

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

async function Curriculum({ curriculumId }) {
  const curriculum = await getCurriculum(curriculumId);
  const learning = await getLearning(curriculum.postingId);

  return (
    <span>
      커리큘럼: {curriculum.title} &gt; 학습: {learning.title}
    </span>
  );
}

async function MissionList() {
  const missions = await getMissionList();

  return (
    <div className="list">
      {missions.map((mission) => (
        <h2 className="list-item" key={mission.missionId}>
          <Link href={`/mission-management/${mission.missionId}`}>
            <span>미션: {mission.title} &gt; </span>
            <Curriculum curriculumId={mission.curriculumId} />
          </Link>
        </h2>
      ))}
    </div>
  );
}

export default async function LearningListPage() {
  return (
    <article className="wrapper">
      <h1 className="header1">미션 목록</h1>
      <MissionList />
    </article>
  );
}
