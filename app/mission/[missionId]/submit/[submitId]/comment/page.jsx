import fetchWithRetry from "../../../../../../functions/api";
import missionstyle from "../../../../mission.module.css";
import CommentList from "./CommentList";

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

  return (
    <article className={missionstyle["form-wrapper"]}>
      <CommentList
        comments={commentList}
        missionId={missionId}
        submitId={submitId}
      />
    </article>
  );
}
