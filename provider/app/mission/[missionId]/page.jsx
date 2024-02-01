import dynamic from "next/dynamic";
import BackButton from "../../../components/BackButton";
import fetchWithRetry from "../../../functions/api";
import UserNick from "@/components/UserNick";
import Link from "next/link";
import ko_kr from "@/langs/ko_kr";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    return {
      title: "",
      content: "",
    };

  return await getMissionResponse.json();
}

async function getMissionSubmitList(missionId) {
  const getMissionSubmitListResponse = await fetchWithRetry(
    `/mission/${missionId}/submit`
  );

  if (!getMissionSubmitListResponse.ok)
    if (getMissionSubmitListResponse.status === 404) return [];
    else throw new Error("미션 목록을 조회하는 중 에러가 발생했습니다.");

  return await getMissionSubmitListResponse.json();
}

function SubmitStatus({ status }) {
  if (status === "SUBMIT")
    return (
      <div className="frame-97 background-purple-04 color-purple-01">
        {ko_kr[status]}
      </div>
    );

  return (
    <div className="frame-97 background-purple-01 color-white">
      {ko_kr[missionSubmit.status]}
    </div>
  );
}

async function SubmitList({ missionId }) {
  const submits = await getMissionSubmitList(missionId);

  return (
    <section className="frame">
      <div className="frame-101">
        <div className="frame-9">
          <h2 className="h4-20 color-black">제출 목록</h2>
        </div>
      </div>
      <div className="line border-gray-05" />
      {submits.map((submit) => (
        <div className="frame-118" key={submit.usrId}>
          <div className="frame-100-2">
            <div className="frame-93-3">
              <Link
                className="h4-20 link"
                href={`/mission/${missionId}/${submit.usrId}`}
              >
                <UserNick usrId={submit.usrId} />
              </Link>
            </div>
          </div>
          <div className="frame-101-2">
            <SubmitStatus status={submit.status} />
          </div>
        </div>
      ))}
    </section>
  );
}

async function Mission({ missionId }) {
  const mission = await getMission(missionId);

  return (
    <section className="frame background-white border-gray-06">
      <div className="frame-101">
        <div className="frame-9">
          <h2 className="h4-20">{mission.title}</h2>
        </div>
      </div>
      <div className="line border-gray-05" />
      <section className="frame-120">
        <Viewer content={mission.missionSubmitForm} height="100%" />
      </section>
    </section>
  );
}

export default async function MissionPage({ params: { missionId } }) {
  return (
    <>
      <header className="nb">
        <BackButton />
      </header>
      <article className="wrapper">
        <div className="frame-93">
          <div className="frame-57">
            <h1 className="h3-24 color-black">미션 제출 양식</h1>
          </div>
          <Mission missionId={missionId} />
          <SubmitList missionId={missionId} />
        </div>
      </article>
    </>
  );
}
