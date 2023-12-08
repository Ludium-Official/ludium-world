import Link from "next/link";
import fetchWithRetry from "../../functions/api";
import announcementstyle from "./announcement.module.css";
import ContentNavigation from "../../components/ContentNavigation";

export const metadata = {
  title: "교육"
}

async function getAnnouncementList() {
  const getannouncementsResponse = await fetchWithRetry(`/announcement`);

  if (!getannouncementsResponse.ok) return [];

  return await getannouncementsResponse.json();
}

export default async function AnnouncementPage() {
  const announcements = await getAnnouncementList();
  const announcementLinks = [
    {
      href: "/announcement/new",
      text: "공고 만들기",
    },
  ];

  return (
    <>
      <div className={announcementstyle["content-navigation"]}>
        <ContentNavigation links={announcementLinks} />
      </div>
      <article className={announcementstyle.wrapper}>
        <h1 className={announcementstyle["title-label"]}>공고 목록</h1>
        <div className={announcementstyle["announcement-list"]}>
          {announcements.map((announcement) => (
            <h2 className={announcementstyle["announcement-list-item"]} key={crypto.randomUUID()}>
              <Link key={announcement.id} href={`/announcement/${announcement.id}`}>
                {announcement.title}
              </Link>
            </h2>
          ))}
        </div>
      </article>
    </>
  );
}
