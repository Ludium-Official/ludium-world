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

async function getUser(userId) {
    const getUserReponse = await fetchWithRetry(`/profile/${userId}`);

    if(!getUserReponse.ok) return null;

    return await getUserReponse.json();
}

async function UserNick({usrId}) {
    const {nick} = await getUser(usrId);

    return <span className={makestyle["make-item-nick"]}>제작자- {nick}</span>
}

export default async function MakePage() {
    const makes = await getMakeList();

    console.log(makes);

    return <article className={makestyle.wrapper}>
        <h1 className={makestyle["title-label"]}>제작 목록</h1>
        <div className={makestyle["make-list"]}>
            {makes.map((make) => (
                <h2 className={makestyle["make-list-item"]} key={crypto.randomUUID()}>
                    <Link className={makestyle["make-item-wrapper"]} key={make.id} href={`/make/${make.id}`}>
                        <span>
                            {make.title}
                        </span>
                        <UserNick usrId={make.usrId} />
                    </Link>
                </h2>
            ))}
        </div>
    </article>;
}