import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment } from "react";
import ApproveWorkButton from "./ApproveWorkButton";
import PinWorkButton from "./PinWorkButton";

const Viewer = dynamic(() => import("@/components/Viewer"), {
  ssr: false,
});

export async function generateMetadata({ params: { workId } }) {
  const work = await getWork(workId);

  return {
    title: work.title,
  };
}

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

// async function getSubmittedWorkContentCommentList(workId, workContentId) {
//   const getSubmittedWorkContentCommentListResponse = await fetchWithRetry(
//     `/detailed-announcement/${workId}/${workContentId}/comment`
//   );

//   if (!getSubmittedWorkContentCommentListResponse.ok)
//     if (getSubmittedWorkContentCommentListResponse.status === 404) return [];
//     else throw new Error(500);

//   return await getSubmittedWorkContentCommentListResponse.json();
// }

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

  if (!getUserResponse.ok)
    if (getUserResponse.status === 404) throw new Error(404);
    else throw new Error(500);

  return await getUserResponse.json();
}

async function Worker({ workId }) {
  const worker = await getWorker(workId);

  if (worker === null) return <p>작업자: 없음</p>;

  const user = await getUser(worker.usrId);

  return <p>작업자: {user.nick}</p>;
}

// async function User({ usrId }) {
//   const user = await getUser(usrId);

//   return <p>작성자: {user.nick}</p>;
// }

// function getCommentTimeStamp(originalDateString) {
//   const originalDate = new Date(originalDateString);

//   const formattedDate = new Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false, // 24시간 형식 사용
//     timeZone: "Asia/Seoul",
//   }).format(originalDate);

//   const splittedDate = formattedDate.replaceAll(", ", "/").split("/");

//   return `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]} ${splittedDate[3]}`;
// }

// async function SubmittedWorkContentCommentList({ workId, workContentId }) {
//   const submittedWorkContentCommentList =
//     await getSubmittedWorkContentCommentList(workId, workContentId);

//   return (
//     <>
//       {submittedWorkContentCommentList.map((submittedWorkContentComment) => (
//         <details
//           className={workstyle["work-content-comment"]}
//           key={submittedWorkContentComment.detailedContentCommentId}
//           open={true}
//         >
//           <summary>댓글 펼치기 / 닫기</summary>
//           <div className={workstyle["work-content-comment-header"]}>
//             <p>
//               작성 일시:{" "}
//               {getCommentTimeStamp(submittedWorkContentComment.createAt)}
//             </p>
//             <User usrId={submittedWorkContentComment.usrId} />
//           </div>
//           <div className={workstyle["work-content-comment-description"]}>
//             <Viewer content={submittedWorkContentComment.description} />
//           </div>
//         </details>
//       ))}
//     </>
//   );
// }

async function SubmittedWorkContentList({ workId }) {
  const workContents = await getSubmittedWorkContentList(workId);

  return (
    <section className="frame-119">
      {workContents.map(({ detailContentId, title }, index) => (
        <Fragment key={detailContentId}>
          <div className="frame-118">
            <div className="frame-100-2">
              <div className="frame-93-3">
                <Link
                  className="link"
                  href={`/work-management/${workId}/${detailContentId}`}
                >
                  <h4 className="h4-20 color-gray-02">
                    {title === "" ? "작업물 제목을 입력해주세요" : title}
                  </h4>
                </Link>
              </div>
            </div>
          </div>
          {index < workContents.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </section>
  );
}

export default async function WorkPage({ params: { workId } }) {
  const work = await getWork(workId);

  return (
    <>
      <header className="nb">
        <BackButton />
        <ApproveWorkButton work={work} />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">작업</h3>
            <PinWorkButton workId={workId} isPinned={work.pinned} />
          </div>
          <div className="frame background-white border-gray-06">
            <div className="frame-101">
              <div className="frame-9">
                <h4 className="h4-20 color-black">
                  {work.title} ({work.status === "CREATE" ? "미승인" : "승인"})
                </h4>
                <Worker workId={workId} />
              </div>
            </div>
            <div className="line border-gray-05" />
            <div className="frame-120">
              <Viewer content={work.description} height="100%" />
            </div>
          </div>
          <div className="frame background-white border-gray-06">
            <div className="frame-101">
              <div className="frame-9">
                <h4 className="h4-20 color-black">제출된 작업물 목록</h4>
              </div>
            </div>
            <SubmittedWorkContentList workId={workId} />
          </div>
        </div>
      </article>
    </>
  );
}
