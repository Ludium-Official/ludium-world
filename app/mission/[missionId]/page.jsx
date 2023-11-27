import ContentNavigation from "../../../components/ContentNavigation";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import missionstyle from "../mission.module.css";

async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    return {
      title: "",
      content: "",
    };

  return await getMissionResponse.json();
}

export default async function MissionPage({ params }) {
  const { missionId } = params;
  const mission = await getMission(missionId);
  const links = [
    {
      href: `/mission`,
      text: "돌아가기",
    },
    {
      href: `/mission/${missionId}/submit/new`,
      text: "미션제출하러가기",
    },
    {
      href: `/mission/${missionId}/submit`,
      text: "미션제출보기",
    },
  ];

  return (
    <>
      <ContentNavigation links={links} />
      <div className={missionstyle["mission-view-wrapper"]}>
        <h1 className={missionstyle["mission-view-title"]}>{mission.title}</h1>
        <div className={missionstyle.content}>
          <Viewer content={mission.content} height={"100%"} />
        </div>
      </div>
    </>
  );
}
