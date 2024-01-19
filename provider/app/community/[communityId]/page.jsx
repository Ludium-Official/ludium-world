import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import UserNick from "@/components/UserNick";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import dynamic from "next/dynamic";
import ContentCommentEditor from "./ContentCommentEditor";
const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

async function getContent(communityId) {
  const getContentResponse = await fetchWithRetry(`/content/${communityId}`);

  if (!getContentResponse.ok)
    throw new Error("콘텐츠를 조회하는 중 에러가 발생했습니다.");

  return await getContentResponse.json();
}

export default async function ContentPage({ params: { communityId } }) {
  const content = await getContent(communityId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
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
        <ContentCommentEditor contentId={communityId} />
      </div>
    </>
  );
}
