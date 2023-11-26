import Link from "next/link";
import ContentNavigation from "../../../../../components/ContentNavigation";
import Viewer from "../../../../../components/Viewer";
import fetchWithRetry from "../../../../../functions/api";
import coursestyle from "../../../course.module.css";

async function getModule(courseId, moduleId) {
  const getModuleResponse = await fetchWithRetry(
    `/course/${courseId}/${moduleId}`
  );

  return await getModuleResponse.json();
}

export default async function ModulePage({ params: { courseId, moduleId } }) {
  const module = await getModule(courseId, moduleId);
  const links = [
    {
      href: `/course/${courseId}/module/${moduleId}/edit`,
      text: "수정하기",
    },
  ];

  return (
    <>
      <ContentNavigation links={links}></ContentNavigation>
      <article className={coursestyle.wrapper}>
        <div className={coursestyle["module-header-area"]}>
          <input type="text" defaultValue={module.title} readOnly />
          <input
            type="text"
            defaultValue={module.category}
            placeholder="카테고리 값 없음"
            readOnly
          />
        </div>
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
      </article>
    </>
  );
}
