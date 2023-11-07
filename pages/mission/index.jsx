import Link from "next/link";

export async function getServerSideProps() {
  const serverUri = process.env.NEXT_PUBLIC_BACKEND_URI;
  const getMissionsResponse = await fetch(`${serverUri}/mission`);

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