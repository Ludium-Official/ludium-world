import fetchWithRetry from "../../../functions/api";
import Viewer from "../../../components/Viewer"
import makestyle from "../make.module.css";
import ContentNavigation from "../../../components/ContentNavigation";
import BackButton from "../../../components/BackButton"
import Link from "next/link";

async function getMake(makeId) {
    const getMakeResponse = await fetchWithRetry(`/article/${makeId}`);

    if (!getMakeResponse.ok) {
        return null;
    }

    return await getMakeResponse.json();
}

export default async function MakePage({ params: { makeId } }) {
    const make = await getMake(makeId);

    return <>
        <ContentNavigation links={[]}>
            <BackButton />
            <Link href={`/make/${makeId}/edit`}>수정하기</Link>
        </ContentNavigation>
        <div className={makestyle["make-view-wrapper"]}>
            <h1 className={makestyle["make-view-title"]}>{make.title}</h1>
            <div className={makestyle.content}>
                <Viewer content={make.content} height={"100%"} />
            </div>
        </div>
    </>
}