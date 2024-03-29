import BackButton from "@/components/BackButton";
import Icon from "@/components/Icon";
import UnAuthorizedError from "@/errors/UnAuthorizedError";
import fetchWithRetry from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import Link from "next/link";

const Viewer = dynamic(() => import("@/components/Viewer"), { ssr: false });

export async function generateMetadata({
  params: { participationId, curriculmId, missionId },
}) {
  const mission = await getMission(missionId);

  return {
    metadataBase: process.env.NEXT_PUBLIC_SITE_MAP_URL,
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
          url: "/logo1.png",
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

async function getMissinoSubmit(learningId, curriculumId, missionId) {
  const cookieStore = cookies();

  try {
    const getMissionSubmitResponse = await fetchWithRetry(
      `/learning/${learningId}/${curriculumId}/mission/${missionId}/submit/user`,
      {
        headers: {
          cookie: cookieStore,
        },
      }
    );

    if (!getMissionSubmitResponse.ok)
      if (getMissionSubmitResponse.status === 404) return null;
      else throw new Error("미션 제출을 조회하는 중 에러가 발생했습니다.");

    return await getMissionSubmitResponse.json();
  } catch (error) {
    if (error instanceof UnAuthorizedError) return null;
    else throw new Error(error.message);
  }
}

export default async function MissionPage({
  params: { participationId, curriculmId, missionId },
}) {
  const mission = await getMission(missionId);
  const missionSubmit = await getMissinoSubmit(
    participationId,
    curriculmId,
    missionId
  );

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
                    <h4 className="h4-20 color-black">{mission.title}</h4>
                  </div>
                  <div className="frame-9-3">
                    <p
                      className={`caption-12 ${
                        missionSubmit === null
                          ? "color-gray-04"
                          : "color-purple-01"
                      }`}
                    >
                      {missionSubmit === null
                        ? ko_kr.NO_COMPLETE
                        : ko_kr[missionSubmit.status]}
                    </p>
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
