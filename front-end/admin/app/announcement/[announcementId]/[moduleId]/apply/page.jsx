import { cookies } from "next/headers";
import fetchWithRetry from "@/functions/api";
import ApplyForm from "./ApplyForm";
import applystyle from "./apply.module.css";
import RedirectEditPage from "./RedirectEditPage";

export const metadata = {
  title: "지원서 작성하기",
};

export async function getApply(moduleId) {
  const applyResponse = await fetchWithRetry(`/module/${moduleId}/apply`);

  if (!applyResponse.ok) return null;

  const apply = await applyResponse.json();

  return apply;
}

export async function getSubmitApplyReference(applyId) {
  const cookieStore = cookies();

  if (cookieStore.get("access_token") === undefined) throw new Error(401);

  const submitApplyResponse = await fetchWithRetry(`/apply/${applyId}/submit`, {
    headers: {
      cookie: cookieStore,
    },
  });

  if (!submitApplyResponse.ok)
    if (submitApplyResponse.status === 403) throw new Error(403);
    else return null;

  return await submitApplyResponse.json();
}

export default async function ApplyPage({ params: { moduleId } }) {
  const apply = await getApply(moduleId);

  const submit = await getSubmitApplyReference(apply.id);

  if (submit.aplId !== null) return <RedirectEditPage />;

  return <ApplyForm apply={apply} />;
}
