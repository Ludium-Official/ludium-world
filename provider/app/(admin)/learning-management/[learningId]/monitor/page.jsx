import BackButton from "@/components/BackButton";
import { ClientSideDataGrid } from "@/components/ClientSideComponents";
import fetchWithRetry from "@/functions/api";

async function getMonitoringList(learningId) {
  const getMonitoringListResponse = await fetchWithRetry(
    `/learning/${learningId}/monitor`
  );

  if (!getMonitoringListResponse.ok) {
    if (getMonitoringListResponse.status === 404) return [];
    else throw new Error(500);
  }

  return await getMonitoringListResponse.json();
}

const getGroupByMission = (monitors) => {
  const groups = {};

  for (const monitor of monitors) {
    if (groups[monitor.mission] == null) {
      groups[monitor.mission] = [];
      groups[monitor.mission].push(monitor);
    } else {
      groups[monitor.mission].push({
        nick: monitor.nick,
        usrId: monitor.usrId,
      });
    }
  }

  return groups;
};

export default async function MissionMonitorPage({ params: { learningId } }) {
  const monitors = await getMonitoringList(learningId);
  const groups = getGroupByMission(monitors);
  const data = Object.values(groups)
    .map((group) => [
      ...group,
      {
        count: group.length === 1 && group[0].nick === null ? 0 : group.length,
      },
    ])
    .flat();

  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <ClientSideDataGrid
          columns={[
            { header: "커리큘럼", name: "curriculum" },
            { header: "미션", name: "mission" },
            { header: "닉네임", name: "nick" },
            { header: "총 갯수", name: "count" },
          ]}
          data={data}
        />
      </article>
    </>
  );
}
