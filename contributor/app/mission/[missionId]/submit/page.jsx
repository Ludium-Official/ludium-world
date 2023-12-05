import ContentNavigation from "../../../../components/ContentNavigation";
import SubmitContent from "../../../../components/mission/SubmitContent";
import fetchWithRetry from "../../../../functions/api";
import submitstyle from "../../mission.module.css";

async function getSubmitList(missionId) {
  const getMissionSumitResponse = await fetchWithRetry(
    `/mission/${missionId}/submit`
  );

  if (!getMissionSumitResponse.ok) return [];

  return await getMissionSumitResponse.json();
}

export default async function MissionSubmitListPage({ params: { missionId } }) {
  const submitList = await getSubmitList(missionId);
  const links = [
    {
      href: `/mission/${missionId}`,
      text: "돌아가기",
    },
  ];

  return (
    <>
      <ContentNavigation links={links} />
      <div className={submitstyle["mission-view-wrapper"]}>
        <h1 className={`${submitstyle["mission-view-title"]} ${submitstyle["mission-view-title-no-background"]}`}>미션 제출 목록</h1>
        <article className={submitstyle["mission-submit-list"]}>
          <p className={submitstyle["mission-submit-item"]}>내용</p>
          <p className={submitstyle["mission-submit-item"]}>작성자</p>
          <p className={submitstyle["mission-submit-item"]}>검증 여부</p>
          <p className={submitstyle["mission-submit-item"]}></p>
          <p className={submitstyle["mission-submit-item"]}></p>
          <p className={submitstyle["mission-submit-item"]}></p>
          <p className={submitstyle["mission-submit-item"]}></p>
          {submitList.map((submit) => (
            <SubmitContent key={submit.id} missionId={missionId} {...submit} />
          ))}
        </article>
      </div>
    </>
  );
}
