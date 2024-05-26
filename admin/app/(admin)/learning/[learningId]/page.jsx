import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import learningstyle from "../learning.module.css";
import ArticleEditor from "./ArticleEditor";
import CreateArticleButton from "./CreateArticlebutton";
import CreateCurriculumButton from "./CreateCurriculumButton";
import CreateMissionButton from "./CreateMissionButton";
import CurriculumEditor from "./CurriculumEditor";
import LearningEditor from "./LearningEditor";
import MissionEditor from "./MissionEditor";

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

async function getMission(learningId, curriculumId, missionId) {
  const getMissionResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/mission/${missionId}`
  );

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

async function getArticle(learningId, curriculumId, articleId) {
  const getArticleResponse = await fetchWithRetry(`/article/${articleId}`);

  if (!getArticleResponse.ok)
    throw new Error("아티클을 조회하는 중 에러가 발생했습니다.");

  return await getArticleResponse.json();
}

async function getContentList(learningId, curriculumId) {
  const getContentListResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/content`
  );

  if (!getContentListResponse.ok)
    if (getContentListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getContentListResponse.json();
}

async function Article({ learningId, curriculumId, articleId }) {
  const article = await getArticle(learningId, curriculumId, articleId);

  return (
    <ArticleEditor
      key={article.articleId}
      article={article}
      postingId={learningId}
    />
  );
}

async function Mission({ learningId, curriculumId, missionId }) {
  const mission = await getMission(learningId, curriculumId, missionId);

  return (
    <MissionEditor
      key={mission.missionId}
      mission={mission}
      postingId={learningId}
    />
  );
}

async function ContentList({ learningId, curriculumId }) {
  const contents = await getContentList(learningId, curriculumId);

  return (
    <>
      {contents.map((content) => (
        <>
          {content.type === "MISSION" ? (
            <Mission
              learningId={learningId}
              curriculumId={curriculumId}
              missionId={content.id}
            />
          ) : (
            <Article
              learningId={learningId}
              curriculumId={curriculumId}
              articleId={content.id}
            />
          )}
          <hr />
        </>
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
        <section
          key={curriculum.curriculumId}
          className={`${learningstyle["background-white"]} ${learningstyle["border-gray"]}`}
        >
          <CurriculumEditor curriculum={curriculum} />
          <hr />
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
          <hr />
          <div>
            <ContentList
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
        <Link href={`/learning/${learningId}/monitor`}>학습 현황</Link>
      </ContentNavigation>
      <LearningContent learningId={learningId} />
    </>
  );
}
