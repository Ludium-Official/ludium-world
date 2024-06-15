import fetchWithRetry, { fetchPayment } from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";
import MissionRewardClaimForm from "./MissionRewardClaimButton";

async function getMissionList(usrId) {
  const getMissionListResponse = await fetchWithRetry(
    `/profile/${usrId}/mission`
  );

  if (!getMissionListResponse.ok)
    if (getMissionListResponse.status === 404) return [];
    else throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionListResponse.json();
}

async function getCoinList() {
  const cookieStore = cookies();
  const header = headers();
  const networkCode = process.env.NEXT_PUBLIC_NETWORK_CODE;

  const getCoinListResponse = await fetchPayment(
    `/api/coin-networks?network_code=${networkCode}`,
    {
      headers: {
        cookie: cookieStore,
        "x-user-right": header.get("x-user-right"),
      },
    }
  );

  if (!getCoinListResponse.ok) {
    throw new Error("코인을 조회하는 중 에러가 발생했습니다.");
  }

  return getCoinListResponse.json();
}

export default async function MissionList({ usrId }) {
  const missions = await getMissionList(usrId);
  const coins = await getCoinList();

  return (
    <div className="frame-93-7">
      <div className="frame-57">
        <h3 className="h3-24 color-black">나의 미션</h3>
      </div>
      <div className="frame-58 background-white border-gray-06">
        <div className="frame-119">
          <div className="frame-123">
            <div className="frame-34-8">
              <div className="frame-9-6">
                <div className="frame-93-2">
                  <h4 className="h4-20 color-purple-01">제목</h4>
                </div>
              </div>
            </div>
            <div className="frame-101-3">
              <div className="frame-93-8">
                <h4 className="h4-20 color-purple-01">토큰 종류</h4>
              </div>
            </div>
            <div className="frame-101-3">
              <div className="frame-93-8">
                <h4 className="h4-20 color-purple-01">보상</h4>
              </div>
            </div>
            <div className="frame-101-3">
              <div className="frame-93-8">
                <h4 className="h4-20 color-purple-01">검증 상태</h4>
              </div>
            </div>
            <div className="frame-101-3">
              <div className="frame-93-8">
                <h4 className="h4-20 color-purple-01">보상 상태</h4>
              </div>
            </div>
            <div className="frame-101-3">
              <div className="frame-93-8">
                {/* <MissionRewardBatchClaimButton /> */}
              </div>
            </div>
          </div>
          <div className="line border-gray-04" />
          {missions.map((mission, index) => (
            <Fragment key={mission.missionId}>
              <div className="frame-118">
                <div className="frame-34-8">
                  <div className="frame-9-6">
                    <div className="frame-93-2">
                      <Link
                        className="link"
                        href={`/participation/${mission.postingId}/${mission.curriculumId}/mission/${mission.missionId}`}
                      >
                        <h4 className="h4-20 color-gray-02">{mission.title}</h4>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="frame-101-3">
                  <div className={`frame-97 border-none`}>
                    <h4 className={`h4-20`}>
                      {mission.rewardToken == null
                        ? "없음"
                        : coins.find(({ id }) => id === mission.rewardToken)
                            .coin.symbol}
                    </h4>
                  </div>
                </div>
                <div className="frame-101-3">
                  <div className={`frame-97 border-none`}>
                    <h4 className={`h4-20`}>{mission.rewardAmount ?? 0}</h4>
                  </div>
                </div>
                <div className="frame-101-3">
                  <div
                    className={`frame-97 ${
                      mission.status === "APPROVE"
                        ? "background-purple-01"
                        : "background-purple-04"
                    }`}
                  >
                    <h4
                      className={`h4-20 ${
                        mission.status === "APPROVE"
                          ? "color-white"
                          : "color-purple-01"
                      }`}
                    >
                      {ko_kr[mission.status]}
                    </h4>
                  </div>
                </div>
                <MissionRewardClaimForm mission={mission} />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
