import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import MissionSubmitEditor from "../../../MissionSubmitEditor";
import MissionSubmitCommentEditor from "../../../MissionSubmitCommentEditor";
import UserNick from "@/components/UserNick";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

async function getProfile() {
  const cookieStore = cookies();
  const getProfileResponse = await fetchWithRetry(`/profile`, {
    headers: {
      cookie: cookieStore,
    },
  });

  if (!getProfileResponse.ok)
    throw new Error("프로필을 불러오는 중 에러가 발생했습니다.");

  return await getProfileResponse.json();
}

async function getMissinoSubmit(learningId, curriculumId, missionId) {
  const cookieStore = cookies();
  const getMissionSubmitResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/mission/${missionId}/submit/user`,
    {
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!getMissionSubmitResponse.ok)
    if (getMissionSubmitResponse.status === 404) return null;
    else throw new Error("미션 제출을 조회하는 중 에러가 발생했습니다.");

  return await getMissionSubmitResponse.json();
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

async function MissionSubmit({ learningId, curriculumId, missionId }) {
  const missionSubmit = await getMissinoSubmit(
    learningId,
    curriculumId,
    missionId
  );

  if (missionSubmit !== null)
    return (
      <details className="mission-submit">
        <summary className="mission-submit-summary"></summary>
        <MissionSubmitEditor
          learningId={learningId}
          curriculumId={curriculumId}
          missionId={missionId}
          missionSubmit={missionSubmit}
          isCreate={false}
        />
      </details>
    );

  const newMission = await getMission(missionId);

  return (
    <details className="mission-submit">
      <summary className="mission-submit-summary"></summary>
      <h4 className="header4">제출 내용</h4>
      <MissionSubmitEditor
        learningId={learningId}
        curriculumId={curriculumId}
        missionId={missionId}
        missionSubmit={newMission}
        isCreate={true}
      />
    </details>
  );
}

async function MissionComment({ missionId }) {
  const profile = await getProfile();
  const comments = await getMissionSubmitCommentList(missionId, profile.id);

  return (
    <div className="mission-comment">
      <h2 className="header2">코멘트</h2>
      <div className="mission-comment-list">
        {comments.map((missionSubmitComment) => (
          <section
            className="comment"
            key={`${missionSubmitComment.missionId} ${missionSubmitComment.createAt}`}
          >
            <span className="space-between comment-header">
              <UserNick usrId={missionSubmitComment.commentor} />
              <span>{getTimeStamp(missionSubmitComment.createAt)}</span>
            </span>
            <div className="comment-content">
              <Viewer
                content={missionSubmitComment.description}
                height="100%"
              />
            </div>
          </section>
        ))}
      </div>
      <MissionSubmitCommentEditor missionId={missionId} usrId={profile.id} />
    </div>
  );
}

export default async function MissionPage({
  params: { participationId, curriculmId, missionId },
}) {
  const mission = await getMission(missionId);

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <section className="space-between">
          <div className="mission">
            <h1 className="header1 space-between">
              <span>{mission.title}</span>
              <span>{getTimeStamp(mission.createAt)}</span>
            </h1>
            <div className="viewer-content">
              <Viewer content={mission.description} height="100%" />
            </div>
          </div>
          <MissionComment missionId={missionId} />
        </section>
        <MissionSubmit
          learningId={participationId}
          curriculumId={curriculmId}
          missionId={missionId}
        />
      </article>
    </>
  );
}
