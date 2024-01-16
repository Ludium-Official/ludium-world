import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import MissionSubmitEditor from "./MissionSubmitEditor";
import { cookies } from "next/headers";
import MISSIONSUBMIT_STATUS from "@/enums/MISSIONSUBMIT_STATUS";
import ArticleSubmitbutton from "./ArticleSubmitButton";
import ARTICLESUBMIT_STATUS from "@/enums/ARTICLESUBMIT_STATUS";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getLearning(learningId) {
  const getLearningResponse = await fetchWithRetry(`/learning/${learningId}`);

  if (!getLearningResponse.ok)
    throw new Error("학습을 조회하는 중 에러가 발생했습니다.");

  return await getLearningResponse.json();
}

async function getCurriculumList(learningId) {
  const getCurriculumListResponse = await fetchWithRetry(
    `/learning/${learningId}/curriculum`
  );

  if (!getCurriculumListResponse.ok)
    if (getCurriculumListResponse.status === 404) return [];
    else throw new Error("커리큘럼을 조회하는 중 에러가 발생했습니다.");

  return await getCurriculumListResponse.json();
}

async function getMissionList(learningId, curriculumId) {
  const getMissionListResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/content`
  );

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션, 아티클을 조회하는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
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

async function getMission(learningId, curriculumId, missionId) {
  const getMissionResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/mission/${missionId}`
  );

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

async function getArticleSubmit(learningId, curriculumId, articleId) {
  const cookieStore = cookies();
  const getArticleSubmitResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/article/${articleId}/submit/user`,
    {
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!getArticleSubmitResponse.ok)
    if (getArticleSubmitResponse.status === 404) return null;
    else throw new Error("아티클 제출을 조회하는 중 에러가 발생했습니다.");

  return await getArticleSubmitResponse.json();
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

async function getUser(usrId) {
  const getUserResponse = await fetchWithRetry(`/user/${usrId}`);

  if (!getUserResponse.ok) throw new Error(500);

  return await getUserResponse.json();
}

async function User({ usrId }) {
  const user = await getUser(usrId);

  return <p>작성자: {user.nick}</p>;
}

async function MissionSubmitComment({ missionId, usrId }) {
  const missionSubmitCommentList = await getMissionSubmitCommentList(
    missionId,
    usrId
  );

  return (
    <details className="mission-submit-comment">
      <summary className="mission-submit-comment-summary" />
      {missionSubmitCommentList.map((missionSubmitComment) => (
        <section
          className="comment"
          key={`${missionSubmitComment.missionId} ${missionSubmitComment.createAt}`}
        >
          <span className="flex-end comment-header">
            <User usrId={missionSubmitComment.commentor} />
            <p>생성일시: {missionSubmitComment.createAt}</p>
          </span>
          <div className="comment-content">
            <Viewer content={missionSubmitComment.description} height="100%" />
          </div>
        </section>
      ))}
    </details>
  );
}

async function MissionSubmit({ learningId, curriculumId, mission }) {
  const missionSubmit = await getMissinoSubmit(
    learningId,
    curriculumId,
    mission.id
  );

  if (missionSubmit !== null)
    return (
      <details className="mission-submit">
        <summary className="mission-submit-summary"></summary>
        <h4 className="header4">제출 내용</h4>
        <MissionSubmitEditor
          learningId={learningId}
          curriculumId={curriculumId}
          missionId={mission.id}
          missionSubmit={missionSubmit}
          isCreate={false}
        />
        <MissionSubmitComment
          missionId={missionSubmit.missionId}
          usrId={missionSubmit.usrId}
        />
      </details>
    );

  const newMission = await getMission(learningId, curriculumId, mission.id);

  return (
    <details className="mission-submit">
      <summary className="mission-submit-summary"></summary>
      <h4 className="header4">제출 내용</h4>
      <MissionSubmitEditor
        learningId={learningId}
        curriculumId={curriculumId}
        missionId={mission.id}
        missionSubmit={newMission.missionSubmitForm}
        isCreate={true}
      />
    </details>
  );
}

async function MissionSummary({ learningId, curriculumId, mission }) {
  const missionSubmit = await getMissinoSubmit(
    learningId,
    curriculumId,
    mission.id
  );

  if (missionSubmit === null)
    return <p className="curriculum-content-status">미제출</p>;

  return (
    <p className="curriculum-content-status">
      {MISSIONSUBMIT_STATUS[missionSubmit.status]}
    </p>
  );
}

async function Mission({ learningId, curriculumId, mission }) {
  return (
    <details className="curriculum-content-viewer">
      <summary className="curriculum-content-summary">
        <div className="space-between">
          <p className="curriculum-content-summary-title">
            [미션] {mission.title}
          </p>
          <MissionSummary
            learningId={learningId}
            curriculumId={curriculumId}
            mission={mission}
          />
        </div>
      </summary>
      <div className="flex-end">
        <MissionSummary
          learningId={learningId}
          curriculumId={curriculumId}
          mission={mission}
        />
      </div>
      <h4 className="curriculum-content-title">{mission.title}</h4>
      <section className="viewer-content">
        <Viewer content={mission.description} height="100%" />
      </section>
      <MissionSubmit
        learningId={learningId}
        curriculumId={curriculumId}
        mission={mission}
      />
    </details>
  );
}

async function Article({ learningId, curriculumId, article }) {
  const articleSubmit = await getArticleSubmit(
    learningId,
    curriculumId,
    article.id
  );

  const articleSubmitStatus =
    articleSubmit === null
      ? ARTICLESUBMIT_STATUS.NO_COMPLETE
      : ARTICLESUBMIT_STATUS[articleSubmit.status];

  return (
    <details className="curriculum-content-viewer">
      <summary className="curriculum-content-summary">
        <div className="space-between">
          <p className="curriculum-content-summary-title">
            [아티클] {article.title}
          </p>
          <p className="curriculum-content-status">{articleSubmitStatus}</p>
        </div>
      </summary>
      <div className="flex-end">
        <p className="curriculum-content-status">{articleSubmitStatus}</p>
      </div>
      <h4 className="curriculum-content-title">{article.title}</h4>
      <section className="viewer-content">
        <Viewer content={article.description} height="100%" />
      </section>
      <div className="center">
        <ArticleSubmitbutton
          learningId={learningId}
          curriculumId={curriculumId}
          articleId={article.id}
        />
      </div>
    </details>
  );
}

async function CurriculumContentList({ learningId, curriculumId }) {
  const contents = await getMissionList(learningId, curriculumId);

  if (contents.length === 0) return null;

  return (
    <article>
      <h3 className="header3">미션 / 아티클 목록</h3>
      {contents.map((content) => (
        <section key={content.id}>
          {content.type === "MISSION" ? (
            <Mission
              learningId={learningId}
              curriculumId={curriculumId}
              mission={content}
            />
          ) : (
            <Article
              learningId={learningId}
              curriculumId={curriculumId}
              article={content}
            />
          )}
        </section>
      ))}
    </article>
  );
}

async function CurriculumList({ learningId }) {
  const curriculums = await getCurriculumList(learningId);

  if (curriculums.length === 0) return null;

  return (
    <section>
      <h2 className="header2">커리큘럼 목록</h2>
      {curriculums.map((curriculum) => (
        <details
          className="viewer-sub"
          key={curriculum.curriculumId}
          open={true}
        >
          <summary className="viewer-sub-summary">
            커리큘럼 펼치기 / 접기
          </summary>
          <h3 className="viewer-title">{curriculum.title}</h3>
          <section className="viewer-content">
            <Viewer content={curriculum.description} height="100%" />
          </section>
          <CurriculumContentList
            learningId={learningId}
            curriculumId={curriculum.curriculumId}
          />
        </details>
      ))}
    </section>
  );
}

async function LearningContent({ learningId }) {
  const learning = await getLearning(learningId);

  return (
    <article className="viewer">
      <h1 className="viewer-title">{learning.title}</h1>
      <section className="viewer-content">
        <Viewer content={learning.description} height="100%" />
      </section>
      <CurriculumList learningId={learningId} />
    </article>
  );
}

export default async function ParticipationPage({
  params: { participationId },
}) {
  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <LearningContent learningId={participationId} />
    </>
  );
}
