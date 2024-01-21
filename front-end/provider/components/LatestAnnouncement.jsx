import Link from "next/link";
import Icon from "./Icon";

export default function LatestAnnouncement() {
  return (
    <header className="lastest-announcement-wrapper">
      <Link className="lastest-announcement" href="#">
        <Icon src="icon_announce.svg" alt="announce" width={24} height={24} />
        <p className="h4-20 lastest-announcement-text">
          최신공지 제목 최신공지 제목 최신공지 제목 최신공지 제목
        </p>
        <p className="lastest-announcement-icon">N</p>
      </Link>
    </header>
  );
}
