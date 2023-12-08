import Link from "next/link";
import fetchWithRetry from "../../functions/api";
import makestyle from "./make.module.css"

export const metadata = {
    title: "제작 목록"
}

async function getMakeList() {
    const getMakeResponse = await fetchWithRetry("/make");

    if (!getMakeResponse.ok) return [];

    return await getMakeResponse.json();
}

export default async function MakePage() {
    const makes = await getMakeList();

    return <article className={makestyle.wrapper}>
        <h1 className={makestyle["title-label"]}>제작 목록</h1>
        <div className={makestyle["make-list"]}>
            {makes.map((make) => (
                <h2 className={makestyle["make-list-item"]} key={crypto.randomUUID()}>
                    <Link key={make.id} href={`/make/${make.id}`}>
                        {make.title}
                    </Link>
                </h2>
            ))}
        </div>
    </article>;
}