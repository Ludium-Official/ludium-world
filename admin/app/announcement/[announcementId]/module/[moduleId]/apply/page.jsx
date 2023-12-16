import { cookies } from "next/headers";
import fetchWithRetry from "../../../../../../functions/api";
import ApplyForm from "./ApplyForm";
import applystyle from "./apply.module.css";

export const metadata = {
    title: "지원서 작성하기"
}

async function getApply(moduleId) {
    const applyResponse = await fetchWithRetry(`/module/${moduleId}/apply`);

    if (!applyResponse.ok) return null;

    const apply = await applyResponse.json();

    return apply;
}

async function getSubmitApply(applyId) {
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

    const submit = await submitApplyResponse.json();

    return submit.aplId !== null;
}

export default async function ApplyPage({ params: { moduleId } }) {
    const apply = await getApply(moduleId);

    const isSubmit = await getSubmitApply(apply.id);

    if (isSubmit) throw new Error(423);

    return <ApplyForm apply={apply} />
}