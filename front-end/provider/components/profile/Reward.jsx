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

async function getWork(workId) {
  const getWorkResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}`
  );

  if (!getWorkResponse.ok)
    if (getWorkResponse.status === 404) throw new Error(404);
    else throw new Error(500);

  return await getWorkResponse.json();
}

async function Mission({ missionId }) {
  const mission = await getMission(missionId);

  return <h2 className="h4-20 color-gray-02">{mission.title}</h2>;
}

async function Work({ workId }) {
  const work = await getWork(workId);

  return <h5 className="h5-18 color-gray-02">{work.title}</h5>;
}

export default async function () {
  const rewards = (await getRewardList()).slice(0, 4);

  return (
    <>
      {rewards.map(
        (
          { id, resource_id, resource_type, detail: { transaction_hash } },
          index
        ) => (
          <Fragment key={id}>
            <div className="frame-40">
              <Link
                className="link"
                href={`${process.env.NEXT_PUBLIC_NEAR_BLOCK_SCAN}/txns/${transaction_hash}`}
                target="_blank"
              >
                {resource_type === "DETAILED_POSTING" ? (
                  <Work workId={resource_id} />
                ) : (
                  <Mission missionId={resource_id} />
                )}
              </Link>
            </div>
            {index < rewards.length - 1 ? (
              <div className="line border-gray-05" />
            ) : null}
          </Fragment>
        )
      )}
    </>
  );
}
