"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import { TRANSACTION_CODE } from "@/enums/REWARD_CLAIM_STATUS";
import { fetchPayment } from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

export async function claimMissionReward({
  missionId,
  coinNetworkId,
  amount,
  userAddress,
  rewardClaimStatus,
}) {
  if (
    [TRANSACTION_CODE.READY, TRANSACTION_CODE.TRANSACTION_APPROVED].includes(
      TRANSACTION_CODE[rewardClaimStatus]
    )
  ) {
    throw new Error("이미 보상이 요청되었습니다.");
  }

  const cookieStore = cookies();
  const header = headers();

  const res = await fetchPayment("/api/reward-claims", {
    method: HTTP_METHOD.POST,
    body: JSON.stringify({
      mission_id: missionId,
      coin_network_id: coinNetworkId,
      amount: amount.toString(),
      user_address: userAddress,
    }),
    headers: {
      cookie: cookieStore,
      "x-user-right": header.get("x-user-right"),
    },
  });

  if (!res.ok) {
    if (res.status === 400) {
      const result = await res.json();

      throw new Error(result.message);
    } else if (res.status === 409) {
      throw new Error("이미 요청된 보상입니다.");
    } else {
      throw new Error("보상을 요청하는 중 에러가 발생했습니다.");
    }
  }
}
