"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createWorkContent({ workId }) {
  const cookieStore = cookies();

  const createWorkContentResponse = await fetchWithRetry(
    `/detailed-announcement/${workId}`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  const { ok, status } = createWorkContentResponse;

  if (!ok) {
    switch (status) {
      case 403:
      case 404: {
        const { message } = await createWorkContentResponse.json();
        throw new Error(message);
      }
      default: {
        throw new Error("작업물을 추가하는 중 에러가 발생했습니다.");
      }
    }
  }

  revalidatePath(`/work/${workId}`);
  revalidatePath(`/work-management/${workId}`);
}

export async function updateWorkContent({ detailContent, title, description }) {
  const cookieStore = cookies();

  const updateWorkContentResponse = await fetchWithRetry(
    `/detailed-announcement/${detailContent.detailId}/${detailContent.detailContentId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        ...detailContent,
        title,
        description,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  const { ok, status } = updateWorkContentResponse;

  if (!ok) {
    switch (status) {
      case 403:
      case 404: {
        const { message } = await updateWorkContentResponse.json();

        throw new Error(message);
      }
      default: {
        throw new Error("작업물을 제출하는 중 에러가 발생했습니다.");
      }
    }
  }

  revalidatePath(`/work/${detailContent.detailId}`);
  revalidatePath(
    `/work/${detailContent.detailId}/${detailContent.detailContentId}`
  );
  revalidatePath(`/work-management/${detailContent.detailId}`);
  revalidatePath(
    `/work-management/${detailContent.detailId}/${detailContent.detailContentId}`
  );
}

export async function submitWorkContent({ detailContent, status }) {
  const cookieStore = cookies();
  const submitWorkContentResponse = await fetchWithRetry(
    `/detailed-announcement/${detailContent.detailId}/${detailContent.detailContentId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        ...detailContent,
        status,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  const { ok } = submitWorkContentResponse;

  if (!ok) {
    switch (submitWorkContentResponse.status) {
      case 403:
      case 404: {
        const { message } = await submitWorkContentResponse.json();
        throw new Error(message);
      }
      default:
        throw new Error("작업물을 제출하는 중에 에러가 발생했습니다.");
    }
  }

  revalidatePath(
    `/work/${detailContent.detailId}/${detailContent.detailContentId}`
  );
  revalidatePath(`/work-management/${detailContent.detailId}`);
  revalidatePath(
    `/work-management/${detailContent.detailId}/${detailContent.detailContentId}`
  );
}

export async function createWorkContentComment({
  workId,
  workContentId,
  description,
}) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/detailed-announcement/${workId}/${workContentId}`,
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
    throw new Error("댓글을 저장하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/work/${workId}/${workContentId}`);
  revalidatePath(`/work-management/${workId}/${workContentId}`);
}

export async function allocateCoWorker({ workId, usrId }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/detailed-announcement/${workId}/co-worker`,
    {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({
        detailId: workId,
        usrId: usrId,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok) {
    throw new Error("공동 작업자 권한을 할당하는 중 에러가 발생했습니다");
  }

  revalidatePath(`/work/${workId}`);
  revalidatePath(`/work/${workId}/co-worker`);
  revalidatePath(`/work/${workId}/[slug]`, "layout");
}

export async function releaseCoWorker({ workId, usrId }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/detailed-announcement/${workId}/co-worker/${usrId}`,
    {
      method: HTTP_METHOD.DELETE,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok) {
    throw new Error("공동 작업자 권한을 해제하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/work/${workId}`);
  revalidatePath(`/work/${workId}/co-worker`);
  revalidatePath(`/work/${workId}/[slug]`, "layout");
}
