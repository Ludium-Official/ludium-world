import dynamic from "next/dynamic";
import fetchWithRetry from "../../../../functions/api";
import applystyle from "../../apply.module.css";

const Viewer = dynamic(() => import("../../../../components/Viewer"), { ssr: false });

async function getProviderApply(applyId) {
    const providerApplyResponse = await fetchWithRetry(`/apply/provider/${applyId}`);

    return await providerApplyResponse.json();
}

export default async function ProviderApplyPage({ params: { applyId } }) {
    const { nick, content } = await getProviderApply(applyId);

    return <article className={applystyle.wrapper}>
        <h1 className={applystyle.title}>{nick}</h1>
        <div className={applystyle["content-area"]} >
            <Viewer content={content}></Viewer>
        </div>
    </article>;
}