import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import learningstyle from "../learning.module.css";
import LearningContentEditor from "./LearningContentEditor";

export async function generateMetadata({ params: { learningId } }) {
  const learning = await getLearning(learningId);
  return {
    title: learning.title,
  };
}

async function getLearning(learningId) {
  const getLearningResponse = await fetchWithRetry(`/learning/${learningId}`);

  if (!getLearningResponse.ok)
    throw new Error("공고를 불러오는 중 에러가 발생했습니다.");

  return await getLearningResponse.json();
}

async function LearningContent({ learningId }) {
  const learning = await getLearning(learningId);

  return (
    <article className={learningstyle["learning-edit-wrapper"]}>
      <LearningContentEditor learning={learning} />
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
