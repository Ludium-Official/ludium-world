import applystyle from "../../apply.module.css";
import { getApply } from "../page";
import EditApplyForm from "./EditApplyForm";

export default async function editApplyPage({ params: { applyId }}) {
    const apply = await getApply(applyId);
    return <article className={applystyle.wrapper}>
        <EditApplyForm apply={apply} />
    </article>
}