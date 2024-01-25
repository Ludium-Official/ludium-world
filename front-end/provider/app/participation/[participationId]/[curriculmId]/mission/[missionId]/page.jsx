import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import MissionSubmitEditor from "../../../MissionSubmitEditor";
import MissionSubmitCommentEditor from "../../../MissionSubmitCommentEditor";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
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
        <MissionSubmitCommentEditor
          missionId={missionSubmit.missionId}
          usrId={missionSubmit.usrId}
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
        <h1 className="header1">
          {mission.title} 작성일: {getTimeStamp(mission.createAt)}
        </h1>
        <div className="viewer-content">
          <Viewer content={mission.description} height="100%" />
        </div>
        <MissionSubmit
          learningId={participationId}
          curriculumId={curriculmId}
          missionId={missionId}
        />
      </article>
    </>
  );
}
