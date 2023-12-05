import Link from "next/link";
import missionliststyle from "./MissionList.module.css";
import Viewer from "../Viewer";

export default function MissionList({ missions }) {
  return (
    <div className={missionliststyle["mission-list-wrapper"]}>
      {missions.map(({ id, title, content, usrId }) => (
        <Link
          key={id}
          href={`/mission/${id}`}
          className={missionliststyle["mission-link-wrapper"]}
        >
          <section className={missionliststyle["mission-wrapper"]}>
            <h1 className={missionliststyle["mission-title"]}>{title}</h1>
            <h2 className={missionliststyle["mission-author"]}>{usrId}</h2>
            <div className={missionliststyle["mission-content"]}>
              <Viewer content={content}></Viewer>
            </div>
          </section>
        </Link>
      ))}
    </div>
  );
}
