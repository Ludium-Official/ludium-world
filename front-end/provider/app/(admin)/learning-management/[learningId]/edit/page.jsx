import BackButton from "@/components/BackButton";
import LearningEditor from "./LearningEditor";
import fetchWithRetry from "@/functions/api";

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

export default async function LearningEditPage({ params: { learningId } }) {
  const learning = await getLearning(learningId);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <section className="frame-34-4">
          <LearningEditor learning={learning} />
        </section>
      </article>
    </>
  );
}
