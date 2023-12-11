import { cookies } from "next/headers";
import fetchWithRetry from "../../../functions/api";
import ApplyForm from "./ApplyForm";
import applystyle from "./apply.module.css";

export const metadata = {
    title: "지원서 작성하기"
}

async function getApply(providerApply) {
    if(providerApply !== null) return providerApply;

    const applyResponse = await fetchWithRetry("/apply");

    if(!applyResponse.ok) return null;

    const apply = await applyResponse.json();

    apply.id = null;
    
    return apply;
}

async function getProviderApply() {
    const cookieStore = cookies();

    const applyResponse = await fetchWithRetry("/apply/provider", {
        headers: {
            cookie: cookieStore,
          },
    });

    if(!applyResponse.ok) return null;

    return await applyResponse.json();
}

export default async function ApplyPage() {
    const apply = await getApply(await getProviderApply());

    return <article className={applystyle.wrapper}>
        <ApplyForm apply={apply} />
    </article>
}