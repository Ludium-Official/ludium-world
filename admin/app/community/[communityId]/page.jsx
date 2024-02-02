import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import UserNick from "@/components/UserNick";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import dynamic from "next/dynamic";
import ContentCommentEditor from "./ContentCommentEditor";
import Link from "next/link";
import COMMUNITY_TYPE from "@/enums/COMMUNITY_TYPE";
import DeleteContentButton from "./DeleteContentButton";
const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export async function generateMetadata({ params: { communityId } }) {
  const content = await getContent(communityId);

  return {
    title: content.title,
    description: content.description,
  };
}

async function getContent(contentId) {
  const getContentResponse = await fetchWithRetry(`/content/${contentId}`);

  if (!getContentResponse.ok)
    throw new Error("콘텐츠를 조회하는 중 에러가 발생했습니다.");

  return await getContentResponse.json();
}

async function getContentCoomentList(contentId) {
  const getContentCommentListResponse = await fetchWithRetry(
    `/content/${contentId}/comment`
  );

  if (!getContentCommentListResponse.ok)
    if (getContentCommentListResponse.status === 404) return [];
    else throw new Error("콘텐츠 댓글을 조회하는 중 에러가 발생했습니다.");

  return await getContentCommentListResponse.json();
}

async function ContentCoomentList({ contentId }) {
  const contentCommentList = await getContentCoomentList(contentId);

  return (
    <>
      <h2 className="header2">댓글 목록</h2>
      <article className="comment-list">
        {contentCommentList.map((contentComment) => (
          <section
            className="comment"
            key={`${contentComment.missionId} ${contentComment.usrId} ${contentComment.createAt}`}
          >
            <section className="space-between margin1">
              <p className="text1">
                작성자: <UserNick usrId={contentComment.usrId} />
              </p>
              <p className="text1">{getTimeStamp(contentComment.createAt)}</p>
            </section>
            <div className="comment-content">
              <Viewer content={contentComment.description} height="100%" />
            </div>
          </section>
        ))}
      </article>
    </>
  );
}

export default async function ContentPage({ params: { communityId } }) {
  const content = await getContent(communityId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
        <Link href={`/community/${communityId}/edit`}>수정 페이지로 이동</Link>
        <DeleteContentButton communityId={communityId} />
      </ContentNavigation>
      <div className="wrapper">
        <div className="space-between">
          <p className="text1">
            작성자: <UserNick usrId={content.usrId} />
          </p>
          <p className="text1">{getTimeStamp(content.createAt)}</p>
        </div>
        <h1 type="text" className="viewer-title">
          {content.title}
        </h1>
        <div className="viewer-content">
          <Viewer content={content.description} height="100%" />
        </div>
        {content.type === COMMUNITY_TYPE.CONTENT ? (
          <>
            <ContentCoomentList contentId={communityId} />
            <ContentCommentEditor contentId={communityId} />
          </>
        ) : null}
      </div>
    </>
  );
}
