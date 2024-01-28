import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import MissionSubmitEditor from "../../../MissionSubmitEditor";
import MissionSubmitCommentEditor from "../../../MissionSubmitCommentEditor";
import UserNick from "@/components/UserNick";
import Icon from "@/components/Icon";
import { Fragment } from "react";
import UnAuthorizedError from "@/errors/UnAuthorizedError";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

async function getProfile() {
  const cookieStore = cookies();

  try {
    const getProfileResponse = await fetchWithRetry(`/profile`, {
      headers: {
        cookie: cookieStore,
      },
    });

    if (!getProfileResponse.ok)
      throw new Error("프로필을 불러오는 중 에러가 발생했습니다.");

    return await getProfileResponse.json();
  } catch (error) {
    if (error instanceof UnAuthorizedError) return null;
    else throw new Error(error.message);
  }
}

async function getMissinoSubmit(learningId, curriculumId, missionId) {
  const cookieStore = cookies();

  try {
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
  } catch (error) {
    if (error instanceof UnAuthorizedError) return null;
    else throw new Error(error.message);
  }
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
  const profile = await getProfile();
  const missionSubmit = await getMissinoSubmit(
    learningId,
    curriculumId,
    missionId
  );

  if (profile === null) return null;

  const newMission = await getMission(missionId);

  return (
    <div className="mission-submit">
      <div className="frame background-white border-gray-06">
        <div className="frame-101">
          <div className="frame-9">
            <h1 className="h4-20 color-black">제출 내용</h1>
          </div>
        </div>
        <MissionSubmitEditor
          learningId={learningId}
          curriculumId={curriculumId}
          missionId={missionId}
          missionSubmit={missionSubmit === null ? newMission : missionSubmit}
          isCreate={missionSubmit === null ? true : false}
        />
      </div>
    </div>
  );
}

async function MissionComment({ missionId }) {
  const profile = await getProfile();
  const comments =
    profile === null
      ? []
      : await getMissionSubmitCommentList(missionId, profile.id);

  return (
    <div className="frame-150">
      <div className="frame background-white border-gray-06 mission-comment">
        <div className="frame-101">
          <div className="frame-9">
            <h2 className="h4-20 color-black">코멘트</h2>
          </div>
        </div>
        <div className="frame-143">
          {comments.map((missionSubmitComment, index) => (
            <Fragment
              key={`${missionSubmitComment.missionId} ${missionSubmitComment.createAt}`}
            >
              <section className="frame-142">
                <div className="frame-140">
                  <div className="frame-10">
                    <div className="frame-141">
                      <h3 className="h5-18">
                        <UserNick usrId={missionSubmitComment.commentor} />
                      </h3>
                      <div className="frame-9-3">
                        <p className="caption-12">
                          {getTimeStamp(missionSubmitComment.createAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="background-white mission-comment-viewer">
                  <Viewer
                    content={missionSubmitComment.description}
                    height="100%"
                  />
                </div>
              </section>
              {index < comments.length - 1 ? (
                <div className="line border-gray-05" />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="frame background-white border-gray-06 mission-comment mission-comment-editor">
        <div className="frame-148">
          <h2 className="h5-18">코멘트 작성하기</h2>
        </div>
        <MissionSubmitCommentEditor
          missionId={missionId}
          usrId={profile === null ? null : profile.id}
        />
      </div>
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
        <section className="frame-151">
          <div className="frame-149">
            <div className="frame background-white border-gray-06">
              <div className="frame-101">
                <div className="frame-9">
                  <div className="frame-145">
                    <Icon
                      src="/icon_flag.svg"
                      alt="mission"
                      width={24}
                      height={24}
                    />
                    <h1 className="h4-20 color-black">{mission.title}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame  background-white border-gray-06">
              <div className="frame-101 mission-content">
                <Viewer content={mission.description} height="100%" />
              </div>
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
