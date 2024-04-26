import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import UserNick from "@/components/UserNick";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import Link from "next/link";
import DeleteContentButton from "./DeleteContentButton";
import PinContentButton from "./PinContentButton";
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

const Content = async ({ communityId }) => {
  const content = await getContent(communityId);

  return (
    <div className="frame-149">
      <div className="frame background-white border-gray-06">
        <div className="frame-101">
          <div className="frame-9">
            <div className="frame-145">
              <h4 className="h4-20 color-black">
                [{ko_kr[content.type]}] {content.title}
              </h4>
            </div>
            <div className="flex-end">
              <PinContentButton
                communityId={communityId}
                isPinned={content.pinned}
              />
              <div className="margin1" />
              <DeleteContentButton communityId={communityId} />
            </div>
          </div>
          <p className="caption-12">
            작성자: <UserNick usrId={content.usrId} />, 생성일시:{" "}
            {getTimeStamp(content.createAt)}
          </p>
        </div>
      </div>
      <div className="frame background-white border-gray-06">
        <div className="frame-101 content-viewer">
          <Viewer content={content.description} height="100%" />
        </div>
      </div>
    </div>
  );
};

export default async function ContentPage({ params: { communityId } }) {
  return (
    <>
      <header className="nb">
        <BackButton />
        <Link
          className="frame-56 link"
          href={`/community-management/${communityId}/edit`}
        >
          <Icon src="/icon_write.svg" alt="수정하기" width={24} height={24} />
          <p className="h4-20 color-purple-01">수정하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <div className="frame-151">
          <Content communityId={communityId} />
        </div>
      </article>
    </>
  );
}
