import Link from "next/link";
import Viewer from "../../../../../components/Viewer";
import fetchWithRetry from "../../../../../functions/api";

async function getModule(courseId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/course/${courseId}/${moduleId}`
  );

  return await getModuleResponse.json();
}

export default async function ModulePage({ params: { courseId, moduleId } }) {
  const module = await getModule(courseId, moduleId);

  return (
    <>
      <Link href={`/course/${courseId}/module/${moduleId}/edit`}>수정하기</Link>
      <hr />
      <input type="text" defaultValue={module.title} readOnly />
      <input
        type="text"
        defaultValue={module.category}
        placeholder="카테고리 값 없음"
        readOnly
      />
      <hr />
      <h1>모듈 참고 링크</h1>
      {module.moduleReferences.map((moduleReference) => (
        <div key={moduleReference.artId}>
          <Link href={`/mission/${moduleReference.artId}`}>
            {moduleReference.artId}
          </Link>
        </div>
      ))}
      <hr />
      <Viewer content={module.content} />
    </>
  );
}
