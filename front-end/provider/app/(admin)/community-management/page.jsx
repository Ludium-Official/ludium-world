import ContentNavigation from "@/components/ContentNavigation";
import UserNick from "@/components/UserNick";
import COMMUNITY_TYPE from "@/enums/COMMUNITY_TYPE";
import fetchWithRetry from "@/functions/api";
import Link from "next/link";
import ko_kr from "@/langs/ko_kr";
import BackButton from "@/components/BackButton";
import { getTimeStamp } from "@/functions/helper";
import Image from "next/image";

export const metadata = {
  title: "콘텐츠 목록",
};

async function getContents() {
  const getContentResposne = await fetchWithRetry("/content");

  if (!getContentResposne.ok)
    if (getContentResposne.status === 404) return [];
    else throw new Error("콘텐츠를 불러오는 중 에러가 발생했습니다.");

  return await getContentResposne.json();
}

async function ContentList() {
  const contents = await getContents();

  return (
    <div className="frame-152">
      {contents.map(({ contentId, title, usrId, type, createAt, banner }) => (
        <div className="frame background-white border-gray-06" key={contentId}>
          <div className="frame-118-2">
            <div className={banner === "" ? "frame-34-5" : "frame-34-11"}>
              <div className="frame-9-6">
                <div className="frame-30"></div>
                <Link
                  className="frame-93-4 link"
                  href={`/community-management/${contentId}`}
                >
                  <h4 className="h4-20 color-gray-02">
                    [{ko_kr[type]}] {title}
                  </h4>
                </Link>
                <div className="frame-100-3">
                  <p className="caption-12 color-gray-04">
                    작성 일시: {getTimeStamp(createAt)}
                  </p>
                </div>
                <div className="frame-100-3">
                  <p className="caption-12 color-gray-04">
                    작성자: <UserNick usrId={usrId} />
                  </p>
                </div>
              </div>
              {banner === "" ? null : (
                <Link href={`/community-management/${contentId}`}>
                  <Image src={banner} alt={title} width={400} height={116} />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function CommunityListPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="flex-end">
          <Link
            href={`/community-management/new?type=${COMMUNITY_TYPE.BANNER}`}
          >
            <h3 className="h3-24">배너추가</h3>
          </Link>
          <div className="margin1" />
          <Link
            href={`/community-management/new?type=${COMMUNITY_TYPE.ANNOUNCEMENT}`}
          >
            <h3 className="h3-24">공지사항 추가</h3>
          </Link>
        </div>
        <div className="frame-93">
          <div className="frame-57">
            <h3 className="h3-24 color-black">콘텐츠 목록</h3>
          </div>
          <ContentList />
        </div>
      </article>
    </>
  );
}
