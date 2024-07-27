"use client";

import { claimMissionReward } from "@/app/actions/payment";
import {
  TRANSACTION_CODE,
  TRANSACTION_VALUES,
} from "@/enums/REWARD_CLAIM_STATUS";
import { useNearWallet } from "@/hooks/wallet";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const MissionReward = ({
  mission,
  missionRewardClaimStatus,
  setMissionRewardClaimStatus,
}) => {
  const { pending } = useFormStatus();

  useEffect(() => {
    const getRewardClaimStatus = async () => {
      const missionListStr =
        localStorage.getItem("ludium-mission-claim") ?? "[]";
      const missionList = JSON.parse(missionListStr);

      if (missionList.includes(mission.missionId)) {
        const missionRewardClaimStatusResponse = await fetch(
          `/profile/reward/claim?resourceId=${mission.missionId}`
        );

        if (!missionRewardClaimStatusResponse.ok) {
          if (missionRewardClaimStatusResponse.status === 404) {
            return;
          } else {
            console.error("미션 보상 요청 상태를 조회할 수 없습니다.");
          }
        }

        const reader = missionRewardClaimStatusResponse.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        reader.read().then(function processText({ done, value }) {
          if (done) {
            const filteredList = missionList.filter(
              (id) => id !== mission.missionId
            );

            localStorage.setItem(
              "ludium-mission-claim",
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
                setMissionRewardClaimStatus(data);
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
          {mission.rewardToken == null ||
          mission.rewardAmount == null ? null : (
            <h4 className={`h4-20`}>
              {pending
                ? "요청중"
                : missionRewardClaimStatus == null
                ? "요청 안됨"
                : TRANSACTION_VALUES[
                    TRANSACTION_CODE[missionRewardClaimStatus]
                  ]}
            </h4>
          )}
        </div>
      </div>
      <div className="frame-101-3">
        <div className={`frame-97 border-none`}>
          {mission.status !== "APPROVE" ? (
            <button disabled={true}>
              <h4 className="h4-20">검증안됨</h4>
            </button>
          ) : mission.rewardToken == null ||
            mission.rewardAmount == null ? null : (
            <button
              type="submit"
              disabled={
                [
                  TRANSACTION_CODE.READY,
                  TRANSACTION_CODE.TRANSACTION_APPROVED,
                ].includes(TRANSACTION_CODE[missionRewardClaimStatus]) ||
                pending
              }
            >
              <h4 className={`h4-20`}>
                {TRANSACTION_CODE[missionRewardClaimStatus] ===
                TRANSACTION_CODE.READY
                  ? "요청중"
                  : TRANSACTION_CODE[missionRewardClaimStatus] ===
                    TRANSACTION_CODE.TRANSACTION_APPROVED
                  ? "지급 완료"
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
};

export default function MissionRewardClaimForm({ mission }) {
  const { accountId } = useNearWallet();
  const [missionRewardClaimStatus, setMissionRewardClaimStatus] = useState(
    mission.rewardClaimStatus
  );

  const handleClaim = async () => {
    const missionListStr = localStorage.getItem("ludium-mission-claim") ?? "[]";
    const missionList = JSON.parse(missionListStr);
    const concatnatedList = missionList.concat(mission.missionId);

    localStorage.setItem(
      "ludium-mission-claim",
      JSON.stringify(concatnatedList)
    );

    const filteredList = missionList.filter((id) => id !== mission.missionId);

    try {
      await claimMissionReward({
        resourceId: mission.missionId,
        resourceType: "MISSION",
        coinNetworkId: mission.rewardToken,
        amount: mission.rewardAmount,
        userAddress: accountId,
        rewardClaimStatus: mission.rewardClaimStatus,
      });
      localStorage.setItem(
        "ludium-mission-claim",
        JSON.stringify(filteredList)
      );
      setMissionRewardClaimStatus("TRANSACTION_APPROVED");
    } catch ({ message }) {
      if (message != "Failed to fetch") {
        localStorage.setItem(
          "ludium-mission-claim",
          JSON.stringify(filteredList)
        );
        alert(message);
      }
    }
  };

  return (
    <form className="reward-claim-form" action={handleClaim}>
      <MissionReward
        mission={mission}
        missionRewardClaimStatus={missionRewardClaimStatus}
        setMissionRewardClaimStatus={setMissionRewardClaimStatus}
      />
    </form>
  );
}
