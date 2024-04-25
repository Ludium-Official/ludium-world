import BackButton from "@/components/BackButton";
import CurriculumEditor from "./CurriculumEditor";
import fetchWithRetry from "@/functions/api";

async function getCurriculum(learningId, curriculumId) {
  const getCurriculumResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}`
  );

  if (!getCurriculumResponse.ok)
    throw new Error("커리큘럼을 조회하는 중 에러가 발생했습니다.");

  return await getCurriculumResponse.json();
}

async function Curriculum({ learningId, curriculumId }) {
  const curriculum = await getCurriculum(learningId, curriculumId);

  return <CurriculumEditor curriculum={curriculum} />;
}

export default async function EditCurriculumPage({
  params: { learningId, curriculumId },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <section className="frame-34-4">
          <Curriculum learningId={learningId} curriculumId={curriculumId} />
        </section>
      </article>
    </>
  );
}
