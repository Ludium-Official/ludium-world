"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createContent({ title, description, banner, type }) {
  const cookieStore = cookies();

  const createContentResponse = await fetchWithRetry(`/content?type=${type}`, {
    method: HTTP_METHOD.POST,
    body: JSON.stringify({
      title,
      description,
      banner,
    }),
    headers: {
      cookie: cookieStore,
    },
  });

  if (!createContentResponse.ok) {
    throw new Error("콘텐츠를 저장하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/community");
  revalidatePath("/community-management");
  redirect("/community-management");
}

export async function updateContent({ title, description, banner, content }) {
  const cookieStore = cookies();

  const updateContentResponse = await fetchWithRetry(
    `/content/${content.contentId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        title,
        description,
        banner,
        ...content,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!updateContentResponse.ok) {
    if (updateContentResponse.status === 403)
      throw new Error("콘텐츠는 작성자만 수정할 수 있습니다.");
    else throw new Error("콘텐츠를 저장하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/community");
  revalidatePath("/community-management");
  revalidatePath(`/community/${content.contentId}`);
  revalidatePath(`/community-management/${content.contentId}`);
  redirect(`/community-management/${content.contentId}`);
}

export async function deleteContent({ communityId }) {
  const cookieStore = cookies();

  const deleteContentResponse = await fetchWithRetry(
    `/content/${communityId}`,
    {
      method: HTTP_METHOD.DELETE,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!deleteContentResponse.ok) {
    throw new Error("콘텐츠를 삭제하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/community");
  revalidatePath("/community-management");
  redirect("/community-management");
}

export async function pinContent({ communityId }) {
  const cookieStore = cookies();

  const pinContentResponse = await fetchWithRetry(
    `/content/${communityId}/pin`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!pinContentResponse.ok) {
    throw new Error("상단 고정하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/community");
  revalidatePath("/community-management");
  revalidatePath(`/community/${communityId}`);
  revalidatePath(`/community-management/${communityId}`);
}

export async function unpinContent({ communityId }) {
  const cookieStore = cookies();

  const unpinContentResponse = await fetchWithRetry(
    `/content/${communityId}/pin`,
    {
      method: HTTP_METHOD.DELETE,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!unpinContentResponse.ok) {
    throw new Error("고정 해제하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/community");
  revalidatePath("/community-management");
  revalidatePath(`/community/${communityId}`);
  revalidatePath(`/community-management/${communityId}`);
}
