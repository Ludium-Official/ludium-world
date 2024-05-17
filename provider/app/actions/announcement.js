"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function CreateAnnouncementApplication({
  announcementId,
  detailId,
  applicationTemplate,
  description,
}) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application`,
    {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({
        ...applicationTemplate,
        description,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok) {
    throw new Error("지원서를 제출하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/announcement/${announcementId}`);
  revalidatePath(`/announcement/${announcementId}/${detailId}`);
  revalidatePath(
    `/announcement/${announcementId}/${detailId}/apply/edit?role=${applicationTemplate.role}`
  );
  revalidatePath(
    `/announcement-management/${announcementId}/${detailId}/application?role=${applicationTemplate.role}`
  );
  redirect(
    `/announcement/${announcementId}/${detailId}/apply/edit?role=${applicationTemplate.role}`
  );
}

export async function updateAnnouncementApplication({
  announcementId,
  detailId,
  application,
  description,
}) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/announcement/${announcementId}/${detailId}/application`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        ...application,
        description,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok) {
    throw new Error("지원서를 제출하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/announcement/${announcementId}`);
  revalidatePath(`/announcement/${announcementId}/${detailId}`);
  revalidatePath(
    `/announcement/${announcementId}/${detailId}/apply/edit?role=${application.role}`
  );
}
