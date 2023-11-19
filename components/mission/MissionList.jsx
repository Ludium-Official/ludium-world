"use client";

import Link from "next/link";
import missionstyle from "./Mission.module.css";

export default function MissionList({ missions }) {
    return <div className={missionstyle["mission-list-wrapper"]}>
        {missions.map(({ id, title }) =>
            <Link key={id} href={`/mission/${id}`}>{title}</Link>
        )}
    </div>
}