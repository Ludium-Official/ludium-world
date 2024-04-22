"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createAnnouncement({ title, description }) {
  const cookieStore = cookies();

  const createAnnouncementResponse = await fetchWithRetry("/announcement", {
    method: HTTP_METHOD.POST,
    body: JSON.stringify({
      title,
      description,
    }),
    headers: {
      cookie: cookieStore,
    },
  });

  if (!createAnnouncementResponse.ok) {
    throw new Error("공고를 생성하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/(common)/announcement", "page");
  revalidatePath("/(admin)/announcement-management", "page");
}

export async function createDetailedAnnouncement({ announcementId }) {
  const cookieStore = cookies();

  const createDetailedAnnouncementResponse = await fetchWithRetry(
    `/announcement/${announcementId}`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!createDetailedAnnouncementResponse.ok)
    throw new Error("작업을 만드는 중 에러가 발생했습니다.");

  revalidatePath(`/(common)/announcement/${announcementId}`);
  revalidatePath(`/(admin)/announcement-management/${announcementId}`);
}

export async function pinAnnouncement({ announcementId }) {
  const cookieStore = cookies();

  const pinAnnouncementResponse = await fetchWithRetry(
    `/announcement/${announcementId}/pin`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!pinAnnouncementResponse.ok) {
    throw new Error("상단 고정하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/(common)/announcement", "page");
  revalidatePath("/(admin)/announcement-management", "page");
  revalidatePath(`/(admin)/announcement-management/${announcementId}`);
}

export async function unpinAnnouncement({ announcementId }) {
  const cookieStore = cookies();

  const pinAnnouncementResponse = await fetchWithRetry(
    `/announcement/${announcementId}/pin`,
    {
      method: HTTP_METHOD.DELETE,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!pinAnnouncementResponse.ok) {
    throw new Error("상단 고정을 해제하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/(common)/announcement", "page");
  revalidatePath("/(admin)/announcement-management", "page");
  revalidatePath(`/(admin)/announcement-management/${announcementId}`);
}

export async function updateModule({
  postingId,
  detailId,
  title,
  description,
  module,
}) {
  const cookieStore = cookies();

  const editModuleResponse = await fetchWithRetry(
    `/announcement/${postingId}/${detailId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        postingId,
        detailId,
        title,
        description,
        ...module,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!editModuleResponse.ok) {
    throw new Error("작업을 수정하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/(common)/announcement/${postingId}`);
  revalidatePath(`/(common)/announcement/${postingId}/${detailId}`);
  revalidatePath(`/(admin)/announcement-management/${postingId}`);
  revalidatePath(`/(admin)/announcement-management/${postingId}/${detailId}`);
}

export async function updateAnnouncement({
  postingId,
  title,
  description,
  announcement,
}) {
  const cookieStore = cookies();

  const createAnnouncementResponse = await fetchWithRetry(
    `/announcement/${postingId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        postingId: postingId,
        title,
        description,
        ...announcement,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!createAnnouncementResponse.ok) {
    throw new Error((await createAnnouncementResponse.json()).message);
  }

  revalidatePath(`/(common)/announcement/${postingId}`);
  revalidatePath(`/(admin)/announcement-management/${postingId}`);
  revalidatePath(`/(admin)/announcement-management/${postingId}/edit`);
}

export async function createApplicationTemplate({
  announcementId,
  detailId,
  title,
  description,
  role,
}) {
  const cookieStore = cookies();

  const createApplicationTemplateResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application-template`,
    {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({
        title,
        description,
        role,
        detailId,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!createApplicationTemplateResponse.ok) {
    throw new Error("지원서 양식을 저장하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/(common)/announcement/${announcementId}`);
  revalidatePath(`/(admin)/announcement-management/${announcementId}`);
  revalidatePath(
    `/(admin)/announcement-management/${announcementId}/${detailId}/application-template?role=${role}`
  );
}

export async function updateApplicationTemplate({
  announcementId,
  detailId,
  title,
  description,
  applicationTemplate,
}) {
  const cookieStore = cookies();

  const createApplicationTemplateResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application-template`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        title,
        description,
        detailId,
        ...applicationTemplate,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!createApplicationTemplateResponse.ok) {
    throw new Error("지원서 양식을 저장하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/(common)/announcement/${announcementId}`);
  revalidatePath(`/(admin)/announcement-management/${announcementId}`);
  revalidatePath(
    `/(admin)/announcement-management/${announcementId}/${detailId}/application-template?role=${applicationTemplate.role}`
  );
}

export async function deleteWorker({ announcementId, detailId, usrId, role }) {
  const cookieStore = cookies();

  const deleteWorkerResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/worker/${usrId}/${role}`,
    {
      method: HTTP_METHOD.DELETE,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!deleteWorkerResponse.ok) {
    throw new Error("작업자 권한을 해제하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/(common)/announcement/${announcementId}`);
  revalidatePath(`/(admin)/announcement-management/${announcementId}`);
  revalidatePath(
    `/(admin)/announcement-management/${announcementId}/${detailId}/application?role=${role}`
  );
}

export async function allocateWorker({
  announcementId,
  detailId,
  usrId,
  role,
}) {
  const cookieStore = cookies();

  const allocateWorkerResponse = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/worker`,
    {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({ detailId, usrId, role }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!allocateWorkerResponse.ok)
    throw new Error("작업자를 할당하는 중 에러가 발생했습니다.");

  revalidatePath(`/(common)/announcement/${announcementId}`);
  revalidatePath(`/(admin)/announcement-management/${announcementId}`);
  revalidatePath(
    `/(admin)/announcement-management/${announcementId}/${detailId}/application?role=${role}`
  );
}
