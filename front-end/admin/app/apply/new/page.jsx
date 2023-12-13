import applystyle from "../apply.module.css";
import NewApplyForm from "./NewApplyForm";

export default function NewApplyPage() {
    return <article className={applystyle.wrapper}>
        <NewApplyForm />
    </article>
}