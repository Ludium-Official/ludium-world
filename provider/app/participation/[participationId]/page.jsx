import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getLearning(learningId) {
  const getLearningResponse = await fetchWithRetry(`/learning/${learningId}`);

  if (!getLearningResponse.ok)
    throw new Error("학습을 조회하는 중 에러가 발생했습니다.");

  return await getLearningResponse.json();
}

async function getCurriculumList(learningId) {
  const getCurriculumListResponse = await fetchWithRetry(
    `/learning/${learningId}/curriculum`
  );

  if (!getCurriculumListResponse.ok)
    if (getCurriculumListResponse.status === 404) return [];
    else throw new Error("커리큘럼을 조회하는 중 에러가 발생했습니다.");

  return await getCurriculumListResponse.json();
}

async function getMissionList(learningId, curriculumId) {
  const getMissionListResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/mission`
  );

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
}

async function CurriculumContentList({ learningId, curriculumId }) {
  const missions = await getMissionList(learningId, curriculumId);

  if (missions.length === 0) return null;
  return (
    <article>
      <h3 className="header3">미션 / 아티클 목록</h3>
      {missions.map((mission) => (
        <details className="viewer-sub2" key={mission.missionId}>
          <summary className="viewer-sub-summary2">미션 펼치기 / 닫기</summary>
          <div className="right-end">
            <button type="button">제출하기</button>
          </div>
          <h4 className="viewer-title2">{mission.title}</h4>
          <section className="viewer-content">
            <Viewer content={mission.description} height="100%" />
          </section>
        </details>
      ))}
    </article>
  );
}

async function CurriculumList({ learningId }) {
  const curriculums = await getCurriculumList(learningId);

  if (curriculums.length === 0) return null;

  return (
    <section>
      <h2 className="header2">커리큘럼 목록</h2>
      {curriculums.map((curriculum) => (
        <details
          className="viewer-sub"
          key={curriculum.curriculumId}
          open={true}
        >
          <summary className="viewer-sub-summary">
            커리큘럼 펼치기 / 닫기
          </summary>
          <h3 className="viewer-title">{curriculum.title}</h3>
          <section className="viewer-content">
            <Viewer content={curriculum.description} height="100%" />
          </section>
          <CurriculumContentList
            learningId={learningId}
            curriculumId={curriculum.curriculumId}
          />
        </details>
      ))}
    </section>
  );
}

async function LearningContent({ learningId }) {
  const learning = await getLearning(learningId);

  return (
    <article className="viewer">
      <h1 className="viewer-title">{learning.title}</h1>
      <section className="viewer-content">
        <Viewer content={learning.description} height="100%" />
      </section>
      <CurriculumList learningId={learningId} />
    </article>
  );
}

export default async function ParticipationPage({
  params: { participationId },
}) {
  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <LearningContent learningId={participationId} />
    </>
  );
}
