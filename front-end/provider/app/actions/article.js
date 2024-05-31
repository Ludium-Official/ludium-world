"use server";

import { revalidatePath } from "next/cache";
import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { cookies } from "next/headers";

export async function ArticleSubmit({ learningId, curriculumId, articleId }) {
  const cookieStore = cookies();

  const { ok, status } = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/article/${articleId}`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!ok && status !== 409) {
    throw new Error("아티클을 완료하는 중 에러가 발생했습니다.");
  }

  revalidatePath(`/participation/${learningId}`);
  revalidatePath(
    `/participation/${learningId}/${curriculumId}/article/${articleId}`
  );
}
