import Link from "next/link";
import { useEffect, useState } from "react";

export default function Mission() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const getMissions = async () => {
      const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
      const getMissionsResponse = await fetch(`${serverUri}/mission`);

      if (getMissionsResponse.ok) {
        setMissions(await getMissionsResponse.json());
      }
    }

    getMissions();
  }, [])

  return (
    <>
      <Link href="/mission/new">글쓰기</Link>
      <h1>글 목록</h1>
      <div style={{display: "flex", flexDirection: "column"}}>
        {missions.map(mission => (
          <Link key={mission.id} href={`/mission/${mission.id}`}>{mission.title}</Link>
        ))}
      </div>
    </>
  )
}