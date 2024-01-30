import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import learningstyle from "../learning.module.css";
import LearningEditor from "./LearningEditor";
import CreateCurriculumButton from "./CreateCurriculumButton";
import CurriculumEditor from "./CurriculumEditor";
import CreateMissionButton from "./CreateMissionButton";
import MissionEditor from "./MissionEditor";
import CreateArticleButton from "./CreateArticlebutton";
import ArticleEditor from "./ArticleEditor";

export async function generateMetadata({ params: { learningId } }) {
  const learning = await getLearning(learningId);
  return {
    title: learning.title,
  };
}

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

async function getArticleList(learningId, curriculumId) {
  const getArticleListResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/article`
  );

  if (!getArticleListResponse.ok)
    if (getArticleListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getArticleListResponse.json();
}

async function ArticleList({ learningId, curriculumId }) {
  const articles = await getArticleList(learningId, curriculumId);

  return (
    <>
      <h3>아티클 목록</h3>
      {articles.map((article) => (
        <ArticleEditor
          key={article.articleId}
          article={article}
          postingId={learningId}
        />
      ))}
    </>
  );
}

async function MissionList({ learningId, curriculumId }) {
  const missions = await getMissionList(learningId, curriculumId);

  return (
    <>
      <h3>미션 목록</h3>
      {missions.map((mission) => (
        <MissionEditor
          key={mission.missionId}
          mission={mission}
          postingId={learningId}
        />
      ))}
    </>
  );
}

async function CurriculumList({ learningId }) {
  const curriculums = await getCurriculumList(learningId);

  return (
    <>
      <h2>커리큘럼 목록</h2>
      {curriculums.map((curriculum) => (
        <section key={curriculum.curriculumId}>
          <CurriculumEditor curriculum={curriculum} />
          <div>
            <CreateMissionButton
              learningId={learningId}
              curriculumId={curriculum.curriculumId}
            />
            <CreateArticleButton
              learningId={learningId}
              curriculumId={curriculum.curriculumId}
            />
          </div>
          <div>
            <MissionList
              learningId={learningId}
              curriculumId={curriculum.curriculumId}
            />
            <ArticleList
              learningId={learningId}
              curriculumId={curriculum.curriculumId}
            />
          </div>
        </section>
      ))}
    </>
  );
}

async function LearningContent({ learningId }) {
  const learning = await getLearning(learningId);

  return (
    <article className={learningstyle["learning-edit-wrapper"]}>
      <LearningEditor learning={learning} />
      <CreateCurriculumButton learningId={learningId} />
      <CurriculumList learningId={learningId} />
    </article>
  );
}

export default async function LearningPage({ params: { learningId } }) {
  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <LearningContent learningId={learningId} />
    </>
  );
}
