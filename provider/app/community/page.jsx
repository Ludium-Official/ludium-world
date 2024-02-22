import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import Icon from "@/components/Icon";
import UserNick from "@/components/UserNick";
import fetchWithRetry from "@/functions/api";
import { getTimeStamp } from "@/functions/helper";
import ko_kr from "@/langs/ko_kr";
import Link from "next/link";

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
      {contents.map(({ contentId, title, usrId, type, createAt }) => (
        <div className="frame background-white border-gray-06" key={contentId}>
          <div className="frame-118-2">
            <div className="frame-34-5">
              <div className="frame-9-2">
                <div className="frame-30"></div>
                <Link
                  className="frame-93-4 link"
                  href={`/community/${contentId}`}
                >
                  <h2 className="h4-20 color-gray-02">
                    [{ko_kr[type]}] {title}
                  </h2>
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function CommunityListPage() {
  const links = [{ href: "/community/new", text: "콘텐츠 추가" }];
  return (
    <>
      <header className="nb">
        <BackButton />
        <Link className="frame-56 link" href="/community/new">
          <Icon src="/icon_write.svg" alt="추가하기" width={24} height={24} />
          <p className="h4-20 color-purple-01">추가하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h1 className="h3-24 color-black">콘텐츠 리스트</h1>
          </div>
          <ContentList />
        </div>
        {/* <article className="flex-end">
          <ContentNavigation links={links} />
        </article> */}
      </article>
    </>
  );
}
