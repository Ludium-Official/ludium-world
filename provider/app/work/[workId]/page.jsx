import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import workstyle from "../work.module.css";
import WorkContentCreateButton from "./WorkContentCreateButton";
import WorkContentEditor from "./WorkContentEditor";

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

async function getWorker(workId) {
  const getWorkerResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/worker`
  );

  if (!getWorkerResponse.ok)
    if (getWorkerResponse.status === 404) return null;
    else throw new Error(500);

  return await getWorkerResponse.json();
}

async function getUser(usrId) {
  const getUserResponse = await fetchWithRetry(`/user/${usrId}`);

  if (!getUserResponse.ok) throw new Error(500);

  return await getUserResponse.json();
}

async function WorkContentList({ workId }) {
  const workContentList = await getWorkContentList(workId);

  return (
    <>
      {workContentList.map((detailContent) => (
        <WorkContentEditor
          key={detailContent.detailContentId}
          detailContent={detailContent}
        />
      ))}
    </>
  );
}

async function Worker({ workId }) {
  const worker = await getWorker(workId);

  if (worker === null) return <p>작업자 없음</p>;

  const user = await getUser(worker.usrId);

  return <p>작업자 : {user.nick}</p>;
}

export default async function WorkPage({ params: { workId } }) {
  const work = await getWork(workId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <div className={workstyle["work-view-wrapper"]}>
        <Worker workId={workId} />
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
