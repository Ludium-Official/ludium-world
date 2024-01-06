import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import workstyle from "../work.module.css";
import WorkContentCommentEditor from "./WorkContentCommentEditor";

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

async function getSubmittedWorkContentList(workId) {
  const getSubmittedWorkContentListResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/content/submit`
  );

  if (!getSubmittedWorkContentListResponse.ok)
    if (getSubmittedWorkContentListResponse.status === 404) return [];
    else throw new Error(500);

  return await getSubmittedWorkContentListResponse.json();
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

async function getUser(usrId) {
  const getUserResponse = await fetchWithRetry(`/user/${usrId}`);

  if (!getUserResponse.ok)
    if (getUserResponse.status === 404) throw new Error(404);
    else throw new Error(500);

  return await getUserResponse.json();
}

async function User({ usrId }) {
  const user = await getUser(usrId);

  return <p>작성자: {user.nick}</p>;
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

async function SubmittedWorkContentCommentList({ workId, workContentId }) {
  const submittedWorkContentCommentList =
    await getSubmittedWorkContentCommentList(workId, workContentId);

  return (
    <>
      {submittedWorkContentCommentList.map((submittedWorkContentComment) => (
        <details
          className={workstyle["work-content-comment"]}
          key={submittedWorkContentComment.detailedContentCommentId}
          open={true}
        >
          <summary>댓글 펼치기 / 닫기</summary>
          <div className={workstyle["work-content-comment-header"]}>
            <p>
              작성 일시:{" "}
              {getCommentTimeStamp(submittedWorkContentComment.createAt)}
            </p>
            <User usrId={submittedWorkContentComment.usrId} />
          </div>
          <div className={workstyle["work-content-comment-description"]}>
            <Viewer content={submittedWorkContentComment.description} />
          </div>
        </details>
      ))}
    </>
  );
}

async function SubmittedWorkContentList({ workId }) {
  const submittedWorkContentList = await getSubmittedWorkContentList(workId);

  return (
    <>
      <h1>작업물 목록(제출)</h1>
      {submittedWorkContentList.map((submittedWorkContent) => (
        <details key={submittedWorkContent.detailContentId} open={true}>
          <summary>{submittedWorkContent.title} 펼치기 / 닫기</summary>
          <article>
            <h1 className={workstyle["work-view-title"]}>
              {submittedWorkContent.title}
            </h1>
            <div className={workstyle.content}>
              <Viewer
                content={submittedWorkContent.description}
                height={"100%"}
              />
            </div>
          </article>
          <h2>댓글 목록</h2>
          <SubmittedWorkContentCommentList
            workId={workId}
            workContentId={submittedWorkContent.detailContentId}
          />
          <WorkContentCommentEditor
            workId={workId}
            workContentId={submittedWorkContent.detailContentId}
          />
        </details>
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
        <SubmittedWorkContentList workId={workId} />
      </div>
    </>
  );
}
