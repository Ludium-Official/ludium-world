import ContentNavigation from "../../../../../../components/ContentNavigation";
import SubmitHistory from "../../../../../../components/mission/SubmitHistory";
import fetchWithRetry from "../../../../../../functions/api";
import missinostyle from "../../../../mission.module.css";

async function getSubmitHistory(missionId, submitId) {
  const getSubmitHistoryResponse = await fetchWithRetry(
    `/mission/${missionId}/submit/${submitId}/history`
  );

  if (!getSubmitHistoryResponse.ok) return [];

  return await getSubmitHistoryResponse.json();
}

export default async function SubmitHistoryPage({
  params: { missionId, submitId },
}) {
  const history = await getSubmitHistory(missionId, submitId);
  const links = [
    {
      href: `/mission/${missionId}/submit`,
      text: "돌아가기",
    },
  ];
  return (
    <>
      <ContentNavigation links={links} />
      <div className={missinostyle["mission-view-wrapper"]}>
        {history.map((item) => (
          <SubmitHistory key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}
