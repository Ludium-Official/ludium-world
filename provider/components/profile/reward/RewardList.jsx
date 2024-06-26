import fetchWithRetry, { fetchPayment } from "@/functions/api";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";

async function getRewardList() {
  const cookieStore = cookies();
  const header = headers();

  const getRewardListResponse = await fetchPayment("/api/me/reward-claims", {
    headers: {
      cookie: cookieStore,
      "x-user-right": header.get("x-user-right"),
    },
  });

  if (!getRewardListResponse.ok)
    throw new Error("나의 보상을 불러오는 중 에러가 발생했습니다.");

  return getRewardListResponse.json();
}

async function getMission(missionId) {
  const getMissionResponse = await fetchWithRetry(`/mission/${missionId}`);

  if (!getMissionResponse.ok)
    throw new Error("미션을 조회하는 중 에러가 발생했습니다.");

  return await getMissionResponse.json();
}

async function Mission({ missionId }) {
  const mission = await getMission(missionId);

  return <h5 className="h5-18 color-gray-02">{mission.title}</h5>;
}

export default async function RewardList() {
  const rewards = await getRewardList();

  return (
    <div className="frame-93-7">
      <div className="frame-57">
        <h3 className="h3-24 color-black">나의 보상</h3>
      </div>
      <div className="frame-34 background-white border-gray-06">
        {rewards.map(
          ({ id, mission_id, detail: { transaction_hash } }, index) => (
            <Fragment key={id}>
              <div className="frame-136">
                <div className="frame-35">
                  <div className="frame-92">
                    {/* <Link
                      className="link"
                      href={`${process.env.NEXT_PUBLIC_NEAR_BLOCK_SCAN}/txns/${transaction_hash}`}
                      target="_blank"
                    > */}
                    <Mission missionId={mission_id} />
                    {/* </Link> */}
                  </div>
                </div>
                <div className="frame-101-2"></div>
                <Link
                  className="link"
                  href={`${process.env.NEXT_PUBLIC_NEAR_BLOCK_SCAN}/txns/${transaction_hash}`}
                  target="_blank"
                >
                  <div className="frame-100 background-purple-04">
                    <p className="learning-status color-purple-01">이동</p>
                  </div>
                </Link>
              </div>
              {index < rewards.length - 1 ? (
                <div className="line border-gray-05" />
              ) : null}
            </Fragment>
          )
        )}
      </div>
    </div>
  );
}
