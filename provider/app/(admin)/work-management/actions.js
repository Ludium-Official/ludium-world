"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import WORK_STATUS from "@/enums/WORK_STATUS";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function approveWork({ work }) {
  const cookieStore = cookies();

  const approveWorkResponse = await fetchWithRetry(
    `/detailed-announcement/${work.detailId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        ...work,
        status: WORK_STATUS.APPROVE,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!approveWorkResponse.ok)
    if (approveWorkResponse.status === 404)
      throw new Error((await approveWorkResponse.json()).message);
    else throw new Error("작업을 승인하는 중 에러가 발생했습니다.");

  revalidatePath(`/work-management/${work.detailId}`);
  revalidatePath(`/work/${work.detailId}`);
}

export async function pinWork({ workId }) {
  const cookieStore = cookies();

  const pinWorkResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/pin`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!pinWorkResponse.ok) {
    throw new Error("상단 고정하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/work-management", "page");
  revalidatePath("/work", "page");
  revalidatePath(`/work-management/${workId}`);
  revalidatePath(`/work/${workId}`);
}

export async function unpinWork({ workId }) {
  const cookieStore = cookies();

  const unpinWorkResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/pin`,
    {
      method: HTTP_METHOD.DELETE,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!unpinWorkResponse.ok) {
    throw new Error("고정 해제하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/work", "page");
  revalidatePath(`/work/${workId}`);
  revalidatePath("/work-management", "page");
  revalidatePath(`/work-management/${workId}`);
}

export async function createComment({ workId, contentId, description }) {
  const cookieStore = cookies();

  const createCommentResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}/${contentId}`,
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

  if (!createCommentResponse.ok) {
    throw new Error("댓글을 저장하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/work/${workId}/${contentId}`);
  revalidatePath(`/work-management/${workId}/${contentId}`);
}
