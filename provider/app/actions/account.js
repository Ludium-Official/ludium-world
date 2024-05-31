"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function signup({ nick, phnNmb, selfIntro, avatar }) {
  const cookieStore = cookies();

  const { ok, status } = await fetchWithRetry(`/user/sign-up/google`, {
    method: "POST",
    body: JSON.stringify({
      nick,
      phnNmb,
      selfIntro,
      avatar,
    }),
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    if (status === 409) {
      throw new Error("이미 가입되었습니다! 홈 화면으로 이동해보세요.");
    } else {
      throw new Error("회원 가입하는 중 에러가 발생했습니다.");
    }
  }
}

export async function updateProfile({ nick, phnNmb, selfIntro, avatar }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/profile`, {
    method: HTTP_METHOD.PUT,
    body: JSON.stringify({
      nick,
      phnNmb,
      selfIntro,
      avatar,
    }),
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    throw new Error("프로필을 업데이트하는 중 에러가 발생했습니다.");
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
}

export async function deleteAccount() {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/user`, {
    method: HTTP_METHOD.DELETE,
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    throw new Error("탈퇴 신청 중 에러가 발생했습니다.");
  }

  cookieStore.delete("access_token");
  cookieStore.delete("ggl_id");

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/profile/edit");
}

export async function setGrantProvider({ id, granted }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(
    `/user/${id}/provider?isProvider=${granted}`,
    {
      method: "PUT",
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok) {
    throw new Error("프로바이더 권한을 설정하는 중 에러가 발생했습니다");
  }

  revalidatePath("/");
  revalidatePath(`/user-management`);
}

export async function setGrantAdmin({ id, granted }) {
  const cookieStore = cookies();

  const { ok } = await fetchWithRetry(`/user/${id}/admin?isAdmin=${granted}`, {
    method: "PUT",
    headers: {
      cookie: cookieStore,
    },
  });

  if (!ok) {
    throw new Error("관리자 권한을 설정하는 중 에러가 발생했습니다");
  }

  revalidatePath("/");
  revalidatePath(`/user-management`);
}
