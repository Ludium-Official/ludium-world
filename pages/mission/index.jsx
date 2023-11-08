import Link from "next/link";
import fetchWithRetry from "../../functions/api";

export async function getServerSideProps() {
  const getMissionsResponse = await fetchWithRetry(`/mission`);

  if (!getMissionsResponse.ok) {
    return {
      props: {
        missions: []
      }
    }
  }

  return {
    props: {
      missions: await getMissionsResponse.json()
    }
  };
}

export default function Mission({ missions }) {

  return <>
    <Link href="/mission/new">글쓰기</Link>

    <h1>글 목록</h1>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {missions.map(mission => (
        <Link key={mission.id} href={`/mission/${mission.id}`}>{mission.title}</Link>
      ))}
    </div>
  </>
}