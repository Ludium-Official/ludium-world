import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import workstyle from "../work.module.css";
import WorkContentCommentEditor from "./WorkContentCommentEditor";
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

async function getSubmittedWorkContentCommentList(workId, workContentId) {
  const getSubmittedWorkContentCommentListResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/${workContentId}/comment`
  );

  if (!getSubmittedWorkContentCommentListResponse.ok)
    if (getSubmittedWorkContentCommentListResponse.status === 404) return [];
    else throw new Error(500);

  return await getSubmittedWorkContentCommentListResponse.json();
}

function getCommentTimeStamp(originalDateString) {
  const originalDate = new Date(originalDateString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24시간 형식 사용
    timeZone: "Asia/Seoul",
  }).format(originalDate);

  const splittedDate = formattedDate.replaceAll(", ", "/").split("/");

  return `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]} ${splittedDate[3]}`;
}

async function WorkContentList({ workId }) {
  const workContentList = await getWorkContentList(workId);

  return (
    <>
      {workContentList.map((detailContent) => (
        <article key={detailContent.detailContentId}>
          <WorkContentEditor detailContent={detailContent} />
          <WorkContentCommentList
            workId={workId}
            workContentId={detailContent.detailContentId}
            status={detailContent.status}
          />
        </article>
      ))}
    </>
  );
}

async function Worker({ workId }) {
  const worker = await getWorker(workId);

  if (worker === null) return <p>작업자: 없음</p>;

  const user = await getUser(worker.usrId);

  return <p>작업자: {user.nick}</p>;
}

async function User({ usrId }) {
  const user = await getUser(usrId);

  return <p>작성자: {user.nick}</p>;
}

async function WorkContentCommentList({ workId, workContentId, status }) {
  if (status === "CREATE") return null;

  const workContentCommentList = await getSubmittedWorkContentCommentList(
    workId,
    workContentId
  );

  return (
    <article className={workstyle["work-content-comment-wrapper"]}>
      <h3>댓글 목록</h3>
      <details className={workstyle["work-content-comment-list"]} open={true}>
        <summary>댓글 목록 펼치기 / 접기</summary>
        {workContentCommentList.map((workContentComment) => (
          <details
            className={workstyle["work-content-comment"]}
            key={workContentComment.detailedContentCommentId}
            open={true}
          >
            <summary>댓글 펼치기 / 접기</summary>
            <div className={workstyle["work-content-comment-header"]}>
              <p>
                작성 일시: {getCommentTimeStamp(workContentComment.createAt)}
              </p>
              <User usrId={workContentComment.usrId} />
            </div>
            <div className={workstyle["work-content-comment-description"]}>
              <Viewer content={workContentComment.description} />
            </div>
          </details>
        ))}
        <WorkContentCommentEditor
          workId={workId}
          workContentId={workContentId}
        />
      </details>
    </article>
  );
}

export default async function WorkPage({ params: { workId } }) {
  const work = await getWork(workId);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <div className="wrapper">
        <div className={workstyle["work-content-comment-header"]}>
          <Worker workId={workId} />
          <p>작업 승인 상태: {work.status === "CREATE" ? "미승인" : "승인"}</p>
        </div>
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
