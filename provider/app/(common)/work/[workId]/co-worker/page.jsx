import BackButton from "@/components/BackButton";
import fetchWithRetry from "@/functions/api";
import CoWorkerDataGrid from "./CoWorkerDataGrid";

async function getUserList() {
  const getUserListResponse = await fetchWithRetry("/user");

  return await getUserListResponse.json();
}

async function getCoWorkerList(workId) {
  const getCoWorkerListResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/co-worker`
  );

  if (!getCoWorkerListResponse.ok) {
    if (getCoWorkerListResponse.status === 404) return [];
    else throw new Error("공동 작업자 목록을 조회하는 중 에러가 발생했습니다.");
  }

  return await getCoWorkerListResponse.json();
}

export default async function CoWorkerPage({ params: { workId } }) {
  const users = await getUserList();
  const coWorkers = await getCoWorkerList(workId);

  const coWorkerIdList = coWorkers.map(({ usrId }) => usrId);
  const filteredUsers = users.filter(({ id }) => !coWorkerIdList.includes(id));

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <section className="wrapper">
        <CoWorkerDataGrid
          workId={workId}
          coWorkers={coWorkers}
          users={filteredUsers}
        />
      </section>
    </>
  );
}
