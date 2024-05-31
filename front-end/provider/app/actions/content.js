"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createContent({ type, title, description, banner }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/content?type=${type}`, {
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

  if (!ok) {
    throw new Error("콘텐츠를 저장하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/community");
  redirect("/community");
}

export async function updateContent({ content, title, description, banner }) {
  const cookieStore = cookies();

  const { ok, status } = await fetchWithRetry(`/content/${content.contentId}`, {
    method: HTTP_METHOD.PUT,
    body: JSON.stringify({
      ...content,
      title,
      description,
      banner,
    }),
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    if (status === 403) {
      throw new Error("콘텐츠는 작성자만 수정할 수 있습니다.");
    } else {
      throw new Error("콘텐츠를 수정하는 중 에러가 발생했습니다.");
    }
  }

  revalidatePath("/community");
  revalidatePath(`/community/${content.contentId}`);
  revalidatePath(`/community/${content.contentId}/edit`);
}

export async function deleteContent({ communityId }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/content/${communityId}`, {
    method: HTTP_METHOD.DELETE,
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    throw new Error("콘텐츠를 삭제하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/community");
  revalidatePath(`/community/${communityId}`);
  redirect("/community");
}

export async function createContentComment({ contentId, description }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/content/${contentId}/comment`, {
    method: HTTP_METHOD.POST,
    body: JSON.stringify({
      description,
    }),
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    throw new Error("댓글을 추가하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/community/${contentId}`);
}

export async function recommendContent({ contentId }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/content/${contentId}/recommend`, {
    method: HTTP_METHOD.POST,
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    throw new Error("추천하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/community/${contentId}`);
}

export async function cancleRecommendContent({ contentId }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/content/${contentId}/recommend`, {
    method: HTTP_METHOD.DELETE,
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    throw new Error("추천을 해제하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/community/${contentId}`);
}
