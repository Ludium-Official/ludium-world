import Link from "next/link";
import ContentNavigation from "../../../../../../../components/ContentNavigation";
// import Viewer from "../../../../../components/Viewer";
import fetchWithRetry from "../../../../../../../functions/api";
import announcementstyle from "../../../../../announcement.module.css";
import BackButton from "../../../../../../../components/BackButton"
// import MakeCreateButton from "./MakeCreateButton";

async function getMake(moduleId, makeId) {
    const getModuleResponse = await fetchWithRetry(
        `/announcement/${moduleId}/${makeId}`
    );

    return await getModuleResponse.json();
}

export async function ModuleViewer({ moduleId, makeId }) {
    const make = await getMake(moduleId, makeId);

    return <>
        <div className={announcementstyle["module-header-area"]}>
            <input type="text" defaultValue={make.title} readOnly />
        </div>
        <div style={{ border: "1px solid", minHeight: "626px" }}>
            {/* <Viewer content={module.content} /> */}
        </div>
    </>;
}

export default async function MakePage({ params: { announcementId, moduleId, makeId } }) {
    //   const links = [{
    //     href: `/announcement/${announcementId}`,
    //     text: "돌아가기"
    //   }, {
    //     href: `/announcement/${announcementId}/module/${moduleId}/edit`,
    //     text: "수정하기",
    //   },
    //   ];

    return (
        <>
            <ContentNavigation links={[]}>
                <BackButton />
                <Link href={`/announcement/${announcementId}/module/${moduleId}/make/${makeId}/edit`}>수정하기</Link>
            </ContentNavigation>
            <article className={announcementstyle.wrapper}>
                <ModuleViewer moduleId={moduleId} makeId={makeId} />
            </article>
        </>
    );
}
