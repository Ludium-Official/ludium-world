import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import UserNick from "@/components/UserNick";
import COMMUNITY_TYPE from "@/enums/COMMUNITY_TYPE";
import UnAuthorizedError from "@/errors/UnAuthorizedError";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";
import ContentCommentEditor from "./ContentCommentEditor";
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

async function ContentCoomentList({ contentId }) {
  const comments = await getContentCoomentList(contentId);

  return (
    <div className="frame background-white border-gray-06 comment">
      <div className="frame-101">
        <div className="frame-9">
          <h2 className="h4-20 color-black">코멘트</h2>
        </div>
      </div>
      <div className="frame-143">
        {comments.map((contentComment, index) => (
          <Fragment key={contentComment.contentId}>
            <section className="frame-142">
              <div className="frame-140">
                <div className="frame-10">
                  <div className="frame-141">
                    <h3 className="h4-18">
                      <UserNick usrId={contentComment.usrId} />
                    </h3>
                    <div className="frame-9-3">
                      <p className="caption-12">
                        {getTimeStamp(contentComment.createAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="comment-viewer background-white">
                <Viewer content={contentComment.description} height="100%" />
              </div>
            </section>
            {index < comments.length - 1 ? (
              <div className="line border-gray-05" />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default async function ContentPage({ params: { communityId } }) {
  const content = await getContent(communityId);
  const profile = await getProfile();

  return (
    <>
      <header className="nb">
        <BackButton />
        {content.type === COMMUNITY_TYPE.CONTENT ? (
          profile === null ? null : (
            <Link
              className="frame-56 link"
              href={`/community/${communityId}/edit`}
            >
              <Icon
                src="/icon_write.svg"
                alt="수정하기"
                width={24}
                height={24}
              />
              <p className="h4-20 color-purple-01">수정하기</p>
            </Link>
          )
        ) : null}
      </header>
      <article className="wrapper">
        <div className="frame-151">
          <div
            className={`frame-149 ${
              content.type === COMMUNITY_TYPE.CONTENT
                ? "comment-included-left"
                : ""
            }`}
          >
            <div className="frame background-white border-gray-06">
              <div className="frame-101">
                <div className="frame-9">
                  <div className="frame-145">
                    <h1 className="h4-20 color-black">{content.title}</h1>
                  </div>
                  <div className="frame-9-3">
                    <p className="caption-12 color-gray-04">
                      <UserNick usrId={content.usrId} />
                    </p>
                    <p className="caption-12 color-gray-04">
                      {getTimeStamp(content.createAt)}
                    </p>
                    {content.type === COMMUNITY_TYPE.CONTENT ? (
                      profile === null ? null : (
                        <DeleteContentButton communityId={communityId} />
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="frame background-white border-gray-06">
              <div className="frame-101 content-viewer">
                <Viewer content={content.description} height="100%" />
              </div>
            </div>
          </div>
          {content.type === COMMUNITY_TYPE.CONTENT ? (
            <div className="frame-150">
              <ContentCoomentList contentId={communityId} />
              <div className="frame background-white border-gray-06 mission-comment mission-comment-editor">
                <div className="frame-148">
                  <h2 className="h5-18">코멘트 작성하기</h2>
                </div>
                <ContentCommentEditor
                  contentId={communityId}
                  usrId={profile === null ? null : profile.id}
                />
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </>
  );
}
