"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function MissionApprove({ missionId, usrId }) {
  const cookieStore = cookies();

  const approveResponse = await fetchWithRetry(
    `/mission/${missionId}/submit/${usrId}`,
    {
      method: HTTP_METHOD.PUT,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!approveResponse.ok) {
    throw new Error("미션을 승인하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/mission/${missionId}`);
  revalidatePath(`/mission/${missionId}/${usrId}`);
}

export async function MissionSubmit({
  learningId,
  curriculumId,
  missionId,
  method,
  body,
}) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/mission/${missionId}`,
    {
      method,
      body,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok) {
    throw new Error("미션을 제출하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/participation/${learningId}`);
  revalidatePath(
    `/participation/${learningId}/${curriculumId}/mission/${missionId}`
  );
  revalidatePath(
    `/participation/${learningId}/${curriculumId}/mission/${missionId}/submit`
  );
  revalidatePath(`/mission/${missionId}`);
}

export async function CreateMissionComment({
  learningId,
  curriculumId,
  missionId,
  usrId,
  description,
}) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/mission/${missionId}/submit/${usrId}/comment`,
    {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({
        description,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok) {
    throw new Error("댓글을 작성하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/participation/${learningId}`);
  revalidatePath(
    `/participation/${learningId}/${curriculumId}/mission/${missionId}`
  );
  revalidatePath(
    `/participation/${learningId}/${curriculumId}/mission/${missionId}/submit`
  );
  revalidatePath(`/mission/${missionId}`);
  revalidatePath(`/mission/${missionId}/${usrId}`);
}
