import MissionSubmitCommentEditor from "@/app/participation/[participationId]/MissionSubmitCommentEditor";
import BackButton from "@/components/BackButton";
import UserNick from "@/components/UserNick";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import { Fragment } from "react";
import ApproveButton from "./ApproveButton";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getMissionSubmit(missionId, usrId) {
  const getMissionSubmitResponse = await fetchWithRetry(
    `/mission/${missionId}/submit/${usrId}`
  );

  if (!getMissionSubmitResponse.ok)
    throw new Error("미션 제출을 조회하는 중 에러가 발생했습니다.");

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

async function MissionSubmit({ missionId, usrId }) {
  const submit = await getMissionSubmit(missionId, usrId);
  return (
    <div className="frame background-white border-gray-06">
      <div className="frame-101">
        <div className="frame-9">
          <h1 className="h4-20 color-black">
            [<UserNick usrId={usrId} />] 제출 내용
          </h1>
          {submit.status === "SUBMIT" ? (
            <h2 className="caption-12 color-gray-02">{ko_kr[submit.status]}</h2>
          ) : (
            <h2 className="caption-12 color-purple-01">
              {ko_kr[submit.status]}
            </h2>
          )}
        </div>
      </div>
      <div className="frame-101 mission-submit-content">
        <Viewer content={submit.description} height="100%" />
      </div>
      <div className="frame-157">
        <ApproveButton
          missionId={missionId}
          usrId={usrId}
          isApproved={submit.status === "APPROVE"}
        />
      </div>
    </div>
  );
}

async function MissionComment({ missionId, usrId }) {
  const comments = await getMissionSubmitCommentList(missionId, usrId);

  return (
    <div className="frame-143">
      {comments.map((comment, index) => (
        <Fragment key={`${comment.missionId} ${comment.createAt}`}>
          <section className="frame-142">
            <div className="frame-140">
              <div className="frame-10">
                <div className="frame-141">
                  <h3 className="h5-18">
                    <UserNick usrId={comment.commentor} />
                  </h3>
                  <div className="frame-9-3">
                    <p className="caption-12">
                      {getTimeStamp(comment.createAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="background-white mission-comment-viewer">
              <Viewer content={comment.description} height="100%" />
            </div>
          </section>
          {index < comments.length - 1 ? (
            <div className="line border-gray-05" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export default async function MissionSubmitPage({
  params: { missionId, usrId },
}) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <section className="frame-151">
          <div className="frame-149 mission-submit">
            <MissionSubmit missionId={missionId} usrId={usrId} />
          </div>
          <div className="frame-150">
            <div className="frame background-white border-gray-06 mission-comment">
              <div className="frame-101">
                <div className="frame-9">
                  <h2 className="h4-20 color-black">코멘트</h2>
                </div>
              </div>
              <MissionComment missionId={missionId} usrId={usrId} />
            </div>
            <div className="frame background-white border-gray-06 mission-comment mission-comment-editor">
              <div className="frame-148">
                <h2 className="h5-18">코멘트 작성하기</h2>
              </div>
              <MissionSubmitCommentEditor missionId={missionId} usrId={usrId} />
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
