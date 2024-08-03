import fetchWithRetry, { fetchPayment } from "@/functions/api";
import ko_kr from "@/langs/ko_kr";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Fragment } from "react";
import WorkRewardClaimForm from "./WorkRewardClaimForm";

async function getWorkList(usrId) {
  const getWorkListResponse = await fetchWithRetry(
    `/profile/${usrId}/detailed-announcement`
  );

  if (!getWorkListResponse.ok)
    if (getWorkListResponse.status === 404) return [];
    else throw new Error("작업을 조회하는 중 에러가 발생했습니다.");

  return getWorkListResponse.json();
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

export default async function MyWorkList({ usrId }) {
  const works = await getWorkList(usrId);
  const coins = await getCoinList();

  return (
    <div className="frame-93-7">
      <div className="frame-57">
        <h3 className="h3-24 color-black">나의 작업</h3>
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
              <div className="frame-93-8"></div>
            </div>
          </div>
          <div className="line border-gray-04" />
          {works.map((work, index) => (
            <Fragment key={work.detailId}>
              <div className="frame-118">
                <div className="frame-34-8">
                  <div className="frame-9-6">
                    <div className="frame-93-2">
                      <Link className="link" href={`/work/${work.detailId}`}>
                        <h4 className="h4-20 color-gray-02">{work.title}</h4>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="frame-101-3">
                  <div className={`frame-97 border-none`}>
                    <h4 className={`h4-20`}>
                      {work.rewardToken == null
                        ? "없음"
                        : coins.find(({ id }) => id === work.rewardToken).coin
                            .symbol}
                    </h4>
                  </div>
                </div>
                <div className="frame-101-3">
                  <div className={`frame-97 border-none`}>
                    <h4 className={`h4-20`}>{work.rewardAmount ?? 0}</h4>
                  </div>
                </div>
                <div className="frame-101-3">
                  <div
                    className={`frame-97 ${
                      work.status === "APPROVE"
                        ? "background-purple-01"
                        : "background-purple-04"
                    }`}
                  >
                    <h4
                      className={`h4-20 ${
                        work.status === "APPROVE"
                          ? "color-white"
                          : "color-purple-01"
                      }`}
                    >
                      {ko_kr[work.status]}
                    </h4>
                  </div>
                </div>
                <WorkRewardClaimForm work={work} />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
