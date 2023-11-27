import fetchWithRetry from "../../../../../../functions/api";
import CommentList from "./CommentList";
import missionstyle from "../../../../mission.module.css";
import ContentNavigation from "../../../../../../components/ContentNavigation";

async function getComments(missionId, submitId) {
  const getCommentsResponse = await fetchWithRetry(
    `/mission/${missionId}/submit/${submitId}/comment`
  );

  if (!getCommentsResponse.ok) return [];

  return await getCommentsResponse.json();
}

export default async function SubmitCommentPage({
  params: { missionId, submitId },
}) {
  const commentList = await getComments(missionId, submitId);
  const links = [{
    href: `/mission/${missionId}/submit`,
    text: "돌아가기"
  }]

  return (
    <>
      <ContentNavigation links={links} />
      <article className={missionstyle["mission-view-wrapper"]}>
        <CommentList
          comments={commentList}
          missionId={missionId}
          submitId={submitId}
          />
      </article>
    </>
  );
}
