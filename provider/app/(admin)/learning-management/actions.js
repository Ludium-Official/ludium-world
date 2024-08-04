"use server";

import HTTP_METHOD from "@/enums/HTTP_METHOD";
import fetchWithRetry from "@/functions/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createLearning({ title, description }) {
  const cookieStore = cookies();

  const createLearningResponse = await fetchWithRetry(`/learning`, {
    method: HTTP_METHOD.POST,
    body: JSON.stringify({
      title,
      description,
    }),
    headers: {
      cookie: cookieStore,
    },
  });

  if (!createLearningResponse.ok) {
    throw new Error("학습을 만드는 중 에러가 발생했습니다.");
  }

  revalidatePath("/learning-management");
  revalidatePath("/participation");
  redirect("/learning-management");
}

export async function updateLearning({ title, description, learning }) {
  const cookieStore = cookies();

  const updateLearningResponse = await fetchWithRetry(
    `/learning/${learning.postingId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        ...learning,
        title,
        description,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!updateLearningResponse.ok) {
    switch (updateLearningResponse.status) {
      case 403:
      case 404: {
        const { message } = await updateLearningResponse.json();
        throw new Error(message);
      }
      default:
        throw new Error("학습을 저장하는 중 에러가 발생했습니다.");
    }
  }

  revalidatePath("/learning-management");
  revalidatePath("/participation");
  revalidatePath(`/learning-management/${learning.postingId}`);
  revalidatePath(`/participation/${learning.postingId}`);
  redirect(`/learning-management/${learning.postingId}`);
}

export async function createCurriculum({ learningId }) {
  const cookieStore = cookies();

  const createCurriculumResponse = await fetchWithRetry(
    `/learning/${learningId}`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!createCurriculumResponse.ok) {
    switch (createCurriculumResponse.status) {
      case 403:
      case 404: {
        const { message } = await createCurriculumResponse.json();
        throw new Error(message);
      }
      default:
        throw new Error("커리큘럼을 만드는 중 에러가 발생했습니다.");
    }
  }

  revalidatePath(`/learning-management/${learningId}`);
  revalidatePath(`/participation/${learningId}`);
}

export async function updateCurriculum({ title, orderNum, curriculum }) {
  const cookieStore = cookies();

  const updateCurriculumResponse = await fetchWithRetry(
    `/learning/${curriculum.postingId}/${curriculum.curriculumId}`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        title,
        orderNum,
        ...curriculum,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!updateCurriculumResponse.ok) {
    switch (updateCurriculumResponse.status) {
      case 403:
      case 404: {
        const { message } = await updateCurriculumResponse.json();
        throw new Error(message);
      }
      default:
        throw new Error("커리큘럼을 저장하는 중 에러가 발생했습니다.");
    }
  }

  revalidatePath(`/learning-management/${curriculum.postingId}`);
  revalidatePath(`/participation/${curriculum.postingId}`);
  redirect(`/learning-management/${curriculum.postingId}`);
}

export async function createMission({ learningId, curriculumId }) {
  const cookieStore = cookies();

  const createMissionResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/mission`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!createMissionResponse.ok) {
    switch (createMissionResponse.status) {
      case 403:
      case 404: {
        const { message } = await createMissionResponse.json();
        throw new Error(message);
      }
      default:
        throw new Error("미션을 추가하는 중 에러가 발생했습니다.");
    }
  }

  revalidatePath(`/learning-management/${learningId}`);
  revalidatePath(`/participation/${learningId}`);
}

export async function updateMission({
  postingId,
  title,
  description,
  missionSubmitForm,
  orderNum,
  rewardToken,
  rewardAmount,
  mission,
}) {
  const cookieStore = cookies();

  const updateMissionResponse = await fetchWithRetry(
    `/learning/${postingId}/${mission.curriculumId}/mission`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        title,
        description,
        missionSubmitForm,
        orderNum,
        rewardToken,
        rewardAmount,
        ...mission,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!updateMissionResponse.ok) {
    switch (updateMissionResponse.status) {
      case 403:
      case 404: {
        const { message } = await updateMissionResponse.json();
        return { error: message };
      }
      default:
        return { error: "미션을 저장하는 중 에러가 발생했습니다." };
    }
  }

  revalidatePath(`/learning-management/${postingId}`);
  revalidatePath(`/participation/${postingId}`);
  revalidatePath(
    `/participation/${postingId}/${mission.curriculumId}/${mission.missionId}`
  );
  redirect(`/learning-management/${postingId}`);
}

export async function createArticle({ learningId, curriculumId }) {
  const cookieStore = cookies();

  const createArticleResponse = await fetchWithRetry(
    `/learning/${learningId}/${curriculumId}/article`,
    {
      method: HTTP_METHOD.POST,
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!createArticleResponse.ok) {
    switch (createArticleResponse.status) {
      case 403:
      case 404: {
        const { message } = await createArticleResponse.json();
        throw new Error(message);
      }
      default:
        throw new Error("아티클을 추가하는 중 에러가 발생했습니다.");
    }
  }

  revalidatePath(`/learning-management/${learningId}`);
  revalidatePath(`/participation/${learningId}`);
}

export async function updateArticle({
  postingId,
  title,
  description,
  orderNum,
  article,
}) {
  const cookieStore = cookies();

  const updateArticleResponse = await fetchWithRetry(
    `/learning/${postingId}/${article.curriculumId}/article`,
    {
      method: HTTP_METHOD.PUT,
      body: JSON.stringify({
        title,
        description,
        orderNum,
        ...article,
      }),
      headers: {
        cookie: cookieStore,
      },
    }
  );

  if (!updateArticleResponse.ok) {
    switch (updateArticleResponse.status) {
      case 403:
      case 404: {
        const { message } = await updateArticleResponse.json();
        throw { error: message };
      }
      default:
        throw { error: "아티클을 저장하는 중 에러가 발생했습니다." };
    }
  }

  revalidatePath(`/learning-management/${postingId}`);
  revalidatePath(`/participation/${postingId}`);
  revalidatePath(
    `/participation/${postingId}/${article.curriculumId}/article/${article.articleId}`
  );
  redirect(`/learning-management/${postingId}`);
}
