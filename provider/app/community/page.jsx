import BackButton from "@/components/BackButton";
import ContentNavigation from "@/components/ContentNavigation";
import UserNick from "@/components/UserNick";
import fetchWithRetry from "@/functions/api";
import ko_kr from "langs/ko_kr";
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
    <div className="list">
      {contents.map(({ contentId, title, usrId, type }) => (
        <h2 className="list-item" key={contentId}>
          <Link className="list-item-link" href={`/community/${contentId}`}>
            <span className="space-between">
              <p className="text1 margin0">
                [{ko_kr[type]}] {title}
              </p>
              <p className="text1 margin0">
                작성자: <UserNick usrId={usrId} />
              </p>
            </span>
          </Link>
        </h2>
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
      </header>
      <article className="wrapper">
        <article className="flex-end">
          <ContentNavigation links={links} />
        </article>
        <ContentList />
      </article>
    </>
  );
}
