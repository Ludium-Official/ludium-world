import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import workstyle from "../work.module.css";
import WorkContentCreateButton from "./WorkContentCreateButton";

const Viewer = dynamic(() => import("@/components/Viewer"), {
  ssr: false,
});

async function getWork(workId) {
  const getWorkResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}`
  );

  if (!getWorkResponse.ok)
    if (getWorkResponse.status === 404) throw new Error(404);
    else throw new Error(500);

  return await getWorkResponse.json();
}

async function getWorkContentList(workId) {
  const getWorkContentListResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/content`
  );

  if (!getWorkContentListResponse.ok)
    if (getWorkContentListResponse.status === 404) return [];
    else throw new Error(500);

  return await getWorkContentListResponse.json();
}

async function WorkContentList({ workId }) {
  const workContentList = await getWorkContentList(workId);

  console.log(workContentList);
  return (
    <>
      {workContentList.map(({ detailContentId, title, description }) => (
        <article key={detailContentId}>
          <p>{title === "" ? "작업물 제목을 수정해주세요" : title}</p>
          <div className={workstyle.content}>
            <Viewer content={description} height={"100%"} />
          </div>
        </article>
      ))}
    </>
  );
}

export default async function WorkPage({ params: { workId } }) {
  const work = await getWork(workId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <div className={workstyle["work-view-wrapper"]}>
        <h1 className={workstyle["work-view-title"]}>{work.title}</h1>
        <div className={workstyle.content}>
          <Viewer content={work.description} height={"100%"} />
        </div>
        <WorkContentCreateButton workId={workId} />
        <WorkContentList workId={workId} />
      </div>
    </>
  );
}
