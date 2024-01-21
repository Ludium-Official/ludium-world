import LatestAnnouncement from "@/components/LatestAnnouncement";
import AnnouncementPage from "./announcement/page";

export const metadata = {
  title: "루디움",
  description:
    "이곳에서는 루디움, 루디움의 공지사항 그리고 전반적인 Web3.0에 대한 정보들을 찾아 볼 수 있어.",
};

export default async function Page() {
  return (
    <>
      <LatestAnnouncement />
      <AnnouncementPage />
    </>
  );
}
