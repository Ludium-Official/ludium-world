import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import fetchWithRetry from "@/functions/api";
import dynamic from "next/dynamic";
import Link from "next/link";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export async function generateMetadata({
  params: { participationId, curriculmId, missionId },
}) {
  const mission = await getMission(missionId);

  return {
    title: mission.title,
    description: mission.description
      .replace(/\[.*?\]\([^)]*?\)/g, "")
      .replace(/\n+/g, "")
      .replace(/#+\s/g, "")
      .replaceAll("*", "")
      .substring(0, 80),
    openGraph: {
      title: mission.title,
      description: mission.description
        .replace(/\[.*?\]\([^)]*?\)/g, "")
        .replace(/\n+/g, "")
        .replace(/#+\s/g, "")
        .replaceAll("*", "")
        .substring(0, 80),
      url: `${process.env.NEXT_PUBLIC_SITE_MAP_URL}/participation/${participationId}/${curriculmId}/mission/${missionId}`,
      siteName: "루디움",
      locale: "ko_KR",
      type: "website",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_MAP_URL}/logo1.svg`,
          width: 70,
          height: 32,
          alt: "루디움",
        },
      ],
    },
  };
}

async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

export default async function MissionPage({
  params: { participationId, curriculmId, missionId },
}) {
  const mission = await getMission(missionId);

  return (
    <>
      <header className="nb">
        <BackButton />
        <Link
          className="frame-56 link"
          href={`/participation/${participationId}/${curriculmId}/mission/${missionId}/submit`}
        >
          <Icon
            src="/icon_flag_purple01.svg"
            alt="제출하기"
            width={24}
            height={24}
          />
          <p className="h4-20 color-purple-01">제출하기</p>
        </Link>
      </header>
      <article className="wrapper">
        <section className="frame-151">
          <div className="frame-149">
            <div className="frame background-white border-gray-06">
              <div className="frame-101">
                <div className="frame-9">
                  <div className="frame-145">
                    <Icon
                      src="/icon_flag.svg"
                      alt="mission"
                      width={24}
                      height={24}
                    />
                    <h1 className="h4-20 color-black">{mission.title}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="frame  background-white border-gray-06">
              <div className="frame-101 mission-content">
                <Viewer content={mission.description} height="100%" />
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
