import Link from "next/link";
import missionstyle from "./Mission.module.css";

export default function MissionList({ missions }) {
  return (
    <div className={missionstyle["mission-list-wrapper"]}>
      {missions.map(({ id, title, content, usrId }) => (
        <Link key={id} href={`/mission/${id}`} className={missionstyle["mission-link-wrapper"]}>
          <section className={missionstyle["mission-wrapper"]}>
            <h1 className={missionstyle["mission-title"]}>{title}</h1>
            <h2 className={missionstyle["mission-author"]}>{usrId}</h2>
            <p className={missionstyle["mission-content"]}>{content}</p>
          </section>
        </Link>
      ))}
    </div>
  );
}