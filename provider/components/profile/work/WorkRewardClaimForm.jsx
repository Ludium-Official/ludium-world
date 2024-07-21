"use client";

import { claimMissionReward } from "@/app/actions/payment";
import {
  TRANSACTION_CODE,
  TRANSACTION_VALUES,
} from "@/enums/REWARD_CLAIM_STATUS";
import { useNearWallet } from "@/hooks/wallet";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

function WorkReward({ work, workRewardClaimStatus, setWorkRewardClaimStatus }) {
  const { pending } = useFormStatus();

  useEffect(() => {
    const getRewardClaimStatus = async () => {
      const workListStr = localStorage.getItem("ludium-work-claim") ?? "[]";
      const workList = JSON.parse(workListStr);

      if (workList.includes(work.detailId)) {
        const rewardClaimStatusResponse = await fetch(
          `/profile/reward/claim?resourceId=${work.detailId}`
        );

        if (!rewardClaimStatusResponse.ok) {
          if (rewardClaimStatusResponse.status === 404) {
            return;
          } else {
            console.error("미션 보상 요청 상태를 조회할 수 없습니다.");
          }
        }

        const reader = rewardClaimStatusResponse.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        reader.read().then(function processText({ done, value }) {
          if (done) {
            const filteredList = workList.filter((id) => id !== work.detailId);

            localStorage.setItem(
              "ludium-work-claim",
              JSON.stringify(filteredList)
            );

            return;
          }

          buffer += decoder.decode(value, { stream: true });

          let boundary = buffer.indexOf("\n\n");
          while (boundary !== -1) {
            const chunk = buffer.slice(0, boundary + 1).trim();
            if (chunk.startsWith("data:")) {
              const data = chunk.slice("data:".length);

              if (TRANSACTION_CODE[data] > 0) {
                setWorkRewardClaimStatus(data);
              }
            }
            buffer = buffer.slice(boundary + 2);
            boundary = buffer.indexOf("\n\n");
          }

          reader.read().then(processText);
        });
      }
    };

    getRewardClaimStatus();
  }, []);

  return (
    <>
      <div className="frame-101-3">
        <div className={`frame-97 border-none`}>
          <h4 className={`h4-20`}>
            {work.rewardToken == null || work.rewardAmount == null
              ? "보상 미설정"
              : pending
              ? "요청중"
              : workRewardClaimStatus == null
              ? "요청 안됨"
              : TRANSACTION_VALUES[TRANSACTION_CODE[workRewardClaimStatus]]}
          </h4>
        </div>
      </div>
      <div className="frame-101-3">
        <div className={`frame-97 border-none`}>
          {work.status !== "APPROVE" ? (
            <button disabled={true}>
              <h4 className="h4-20">검증안됨</h4>
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                [
                  TRANSACTION_CODE.READY,
                  TRANSACTION_CODE.TRANSACTION_APPROVED,
                ].includes(TRANSACTION_CODE[workRewardClaimStatus]) ||
                pending ||
                work.rewardToken == null ||
                work.rewardAmount == null
              }
            >
              <h4 className={`h4-20`}>
                {work.rewardToken == null || work.rewardAmount == null
                  ? "보상 없음"
                  : TRANSACTION_CODE[workRewardClaimStatus] ===
                    TRANSACTION_CODE.READY
                  ? "요청중"
                  : TRANSACTION_CODE[workRewardClaimStatus] ===
                    TRANSACTION_CODE.TRANSACTION_APPROVED
                  ? "요청 완료"
                  : pending
                  ? "요청중"
                  : "보상 요청"}
              </h4>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function WorkRewardClaimForm({ work }) {
  const { accountId } = useNearWallet();
  const [workRewardClaimStatus, setWorkRewardClaimStatus] = useState(
    work.rewardClaimStatus
  );

  const handleClaim = async () => {
    const workListStr = localStorage.getItem("ludium-work-claim") ?? "[]";
    const workList = JSON.parse(workListStr);
    const concatnatedList = workList.concat(work.detailId);

    localStorage.setItem("ludium-work-claim", JSON.stringify(concatnatedList));

    const filteredList = workList.filter((id) => id !== work.detailId);

    try {
      await claimMissionReward({
        resourceId: work.detailId,
        resourceType: "DETAILED_POSTING",
        coinNetworkId: work.rewardToken,
        amount: work.rewardAmount,
        userAddress: accountId,
        rewardClaimStatus: work.rewardClaimStatus,
      });
      localStorage.setItem("ludium-work-claim", JSON.stringify(filteredList));
      setWorkRewardClaimStatus("TRANSACTION_APPROVED");
    } catch ({ message }) {
      if (message != "Failed to fetch") {
        localStorage.setItem("ludium-work-claim", JSON.stringify(filteredList));
        alert(message);
      }
    }
  };

  return (
    <form className="reward-claim-form" action={handleClaim}>
      <WorkReward
        work={work}
        workRewardClaimStatus={workRewardClaimStatus}
        setWorkRewardClaimStatus={setWorkRewardClaimStatus}
      />
    </form>
  );
}
