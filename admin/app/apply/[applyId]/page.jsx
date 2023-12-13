import dynamic from "next/dynamic";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import ContentNavigation from "../../../components/ContentNavigation";
import fetchWithRetry from "../../../functions/api";
import applystyle from "../apply.module.css";

const Viewer = dynamic(() => import("../../../components/Viewer"), { ssr: false });

export async function getApply(applyId) {
    const applyResponse = await fetchWithRetry(`/apply/${applyId}`);

    if (!applyResponse.ok) return null;

    return await applyResponse.json();
}

export default async function ApplyPage({ params: { applyId } }) {
    const apply = await getApply(applyId);

    return <>
        <ContentNavigation links={[]}>
            <BackButton />
            <Link href={`/apply/${applyId}/edit`}>수정하기</Link>
        </ContentNavigation>
        <article className={applystyle.wrapper}>
            <h1 className={applystyle.title}>{apply.title}</h1>
            <section className={applystyle["content-area"]}>
                <Viewer content={apply.content} height="100%" />
            </section>
        </article>
    </>
}