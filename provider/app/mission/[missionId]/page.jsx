import ContentNavigation from "../../../components/ContentNavigation";
import Viewer from "../../../components/Viewer";
import fetchWithRetry from "../../../functions/api";
import missionstyle from "../mission.module.css";
import BackButton from "../../../components/BackButton";

export async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    return {
      title: "",
      content: "",
    };

  return await getMissionResponse.json();
}

export default async function MissionPage({ params: { missionId } }) {
  const mission = await getMission(missionId);

  return (
    <>
      <ContentNavigation links={[]}>
        <BackButton />
      </ContentNavigation>
      <div className={missionstyle["mission-view-wrapper"]}>
        <h1 className={missionstyle["mission-view-title"]}>{mission.title}</h1>
        <div className={missionstyle.content}>
          <Viewer content={mission.content} height={"100%"} />
        </div>
      </div>
    </>
  );
}
