import Link from "next/link";
import fetchWithRetry from "../../../functions/api"
import applystyle from "../apply.module.css"

async function getProviderApplyList() {
    const providerApplyListResponse = await fetchWithRetry("/apply/provider/all");

    if(!providerApplyListResponse.ok) return [];

    return await providerApplyListResponse.json();
}

export default async function ProviderApplyListPage() {
    const providerApplyList = await getProviderApplyList();

    return <article className={applystyle.wrapper}>
        {providerApplyList.map(({nick, applyId}) => 
            <section key={crypto.randomUUID()}>
                <Link href={`/apply/provider/${applyId}`}>{nick} 지원서 보러가기</Link>
            </section>
        )}
    </article>
}