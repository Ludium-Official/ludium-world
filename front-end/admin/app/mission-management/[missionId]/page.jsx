import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import ApproveMissionSubmitButton from "./ApproveMissionSubmitButton";
import MISSIONSUBMIT_STATUS from "@/enums/MISSIONSUBMIT_STATUS";
import ApproveMissionCommentEditor from "./ApproveMissionCommentEditor";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    throw new Error("미션을 조히하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

async function getMissionSubmitList(missionId) {
  const getMissionSubmitListResponse = await fetchWithRetry(
    `/mission/${missionId}/submit`
  );

  if (!getMissionSubmitListResponse.ok)
    if (getMissionSubmitListResponse.status === 404) return [];
    else throw new Error("미션 목록을 조회하는 중 에러가 발생했습니다.");

  return await getMissionSubmitListResponse.json();
}

async function getUser(usrId) {
  const getUserResponse = await fetchWithRetry(`/user/${usrId}`);

  if (!getUserResponse.ok)
    throw new Error("사용자를 조회하는 중 에러가 발생했습니다.");

  return await getUserResponse.json();
}

async function getMissionSubmitCommentList(missionId, usrId) {
  const getMissionSubmitCommentListResponse = await fetchWithRetry(
    `/mission/${missionId}/submit/${usrId}/comment`
  );

  if (!getMissionSubmitCommentListResponse.ok)
    if (getMissionSubmitCommentListResponse.status === 404) return [];
    else throw new Error("미션 제출 댓글을 조회하는 중 에러가 발생했습니다.");

  return await getMissionSubmitCommentListResponse.json();
}

async function MissionSubmitCommentList({ missionId, usrId }) {
  const missionSubmitComments = await getMissionSubmitCommentList(
    missionId,
    usrId
  );

  return (
    <>
      <h2>댓글 목록</h2>
      {missionSubmitComments.map((missionSubmitComment) => (
        <article
          key={`${missionSubmitComment.missionId} ${missionSubmitComment.createAt}`}
        >
          <div className="flex-end">
            <span>
              댓글 작성자: <User usrId={missionSubmitComment.commentor} />
            </span>
          </div>
          <div className="viewer">
            <Viewer content={missionSubmitComment.description} height="100%" />
          </div>
        </article>
      ))}
    </>
  );
}

async function User({ usrId }) {
  const user = await getUser(usrId);

  return <span>{user.nick}</span>;
}

async function MissionSubmitList({ missionId }) {
  const missionSubmits = await getMissionSubmitList(missionId);

  return (
    <>
      {missionSubmits.map((missionSubmit) => (
        <details key={missionSubmit.usrId} open={true}>
          <summary>
            <span>
              제출자 : <User usrId={missionSubmit.usrId} />
              <p>제출 상태: {MISSIONSUBMIT_STATUS[missionSubmit.status]}</p>
            </span>
          </summary>
          <div className="flex-end">
            <ApproveMissionSubmitButton
              missionId={missionSubmit.missionId}
              usrId={missionSubmit.usrId}
              isApproved={missionSubmit.status === "APPROVE"}
            />
          </div>
          <div className="viewer">
            <Viewer content={missionSubmit.description} height="100%" />
          </div>
          <section>
            <MissionSubmitCommentList
              missionId={missionSubmit.missionId}
              usrId={missionSubmit.usrId}
            />
            <ApproveMissionCommentEditor
              missionId={missionSubmit.missionId}
              usrId={missionSubmit.usrId}
            />
          </section>
        </details>
      ))}
    </>
  );
}

export default async function MissionPage({ params: { missionId } }) {
  const mission = await getMission(missionId);

  return (
    <article className="wrapper">
      <h1 className="header1">미션 제출 양식</h1>
      <div className="viewer">
        <Viewer content={mission.missionSubmitForm} height="100%" />
      </div>
      <h2>미션 제출 목록</h2>
      <MissionSubmitList missionId={missionId} />
    </article>
  );
}
