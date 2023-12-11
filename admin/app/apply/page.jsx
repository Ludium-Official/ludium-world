import fetchWithRetry from "../../functions/api";
import ApplyForm from "./ApplyForm";
import applystyle from "./apply.module.css";

async function getApply() {
    const applyResponse = await fetchWithRetry("/apply");

    if(!applyResponse.ok) return null;

    return await applyResponse.json();
}

export default async function ApplyPage() {
    const apply = await getApply();

    return <article className={applystyle.wrapper}>
        <ApplyForm apply={apply} />
    </article>
}