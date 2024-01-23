import Link from "next/link";
import fetchWithRetry from "../../functions/api";
import announcementstyle from "./announcement.module.css";
import BackButton from "@/components/BackButton";

export const metadata = {
  title: "공고 목록",
};

async function getAnnouncementList() {
  const getannouncementsResponse = await fetchWithRetry(`/announcement`);

  if (!getannouncementsResponse.ok) return [];

  return await getannouncementsResponse.json();
}

async function AnnouncementList() {
  const announcements = await getAnnouncementList();

  return (
    <>
      {announcements.map(({ postingId, title }) => (
        <h2
          className={announcementstyle["announcement-list-item"]}
          key={postingId}
        >
          <Link href={`/announcement/${postingId}`}>{title}</Link>
        </h2>
      ))}
    </>
  );
}

export default async function AnnouncementPage() {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <h1 className={announcementstyle["title-label"]}>공고 목록</h1>
        <div className={announcementstyle["announcement-list"]}>
          <AnnouncementList />
        </div>
      </article>
    </>
  );
}
