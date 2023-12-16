import dynamic from "next/dynamic";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import ContentNavigation from "../../../components/ContentNavigation";
import fetchWithRetry from "../../../functions/api";
import applystyle from "../apply.module.css";
import ApplyModule from "./ApplyModule";

const Viewer = dynamic(() => import("../../../components/Viewer"), { ssr: false });

export async function getApply(applyId) {
    const applyResponse = await fetchWithRetry(`/apply/${applyId}`);

    if (!applyResponse.ok) return null;

    return await applyResponse.json();
}

async function getModuleList() {
    const moduleListResponse = await fetchWithRetry("/module");

    if (!moduleListResponse.ok) return [];

    return await moduleListResponse.json();
}

async function getModuleReference(applyId) {
    const moduleReferenceResponse = await fetchWithRetry(`/apply/${applyId}/moduleReference`);

    if (!moduleReferenceResponse.ok) return null;

    return await moduleReferenceResponse.json();
}

async function ModuleList({ applyId }) {
    const modules = await getModuleList();
    const selectedModuleReferenece = await getModuleReference(applyId);

    return <ApplyModule applyId={applyId} modules={modules} moduleReferenece={selectedModuleReferenece} />
}

async function getSubmitApplyCount(applyId) {
    const submitApplyCount = await fetchWithRetry(`/apply/${applyId}/submit/count`);

    if (!submitApplyCount.ok) return 0;

    return await submitApplyCount.json();
}

export default async function ApplyPage({ params: { applyId } }) {
    const apply = await getApply(applyId);
    const submitApplyCount = await getSubmitApplyCount(applyId);

    return <>
        <ContentNavigation links={[]}>
            <BackButton />
            <Link href={`/apply/${applyId}/edit`}>수정하기</Link>
        </ContentNavigation>
        <article className={applystyle.wrapper}>
            <h1>현재 제출된 지원서 : {submitApplyCount} 개</h1>
            <ModuleList applyId={applyId} />
            <h1 className={applystyle.title}>{apply.title}</h1>
            <section className={applystyle["content-area"]}>
                <Viewer content={apply.content} height="100%" />
            </section>
        </article>
    </>
}