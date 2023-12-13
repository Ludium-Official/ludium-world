import Link from "next/link";
import fetchWithRetry from "../../functions/api"
import applystyle from "./apply.module.css"
import ContentNavigation from "../../components/ContentNavigation"

async function getApplyList() {
    const getApplyListResponse = await fetchWithRetry("/apply");

    if (!getApplyListResponse.ok) return [];

    return await getApplyListResponse.json();
}

export default async function ApplyListPage() {
    const applies = await getApplyList();
    const links = [{
        href: "/apply/new",
        text: "지원서 만들기"
    }]

    return <>
        <div className={applystyle["content-navigation"]}>
            <ContentNavigation links={links} />
        </div>
        <article className={applystyle.wrapper}>
            <section className={applystyle["apply-list"]}>
            {applies.map(({ id, title }) => <h2 className={applystyle["apply-list-item"]} key={crypto.randomUUID()}>
                <Link href={`/apply/${id}`}>{title}</Link>
            </h2>)}

            </section>
        </article>
    </>;
}