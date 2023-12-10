import ManagementForm from "./ManagementForm";
import managementstyle from "./management.module.css"
import fetchWithRetry from "../../functions/api";

async function getUsers() {
    const getUserListResponse = await fetchWithRetry("/user");

    if(!getUserListResponse.ok) {
        return [];
    }

    return await getUserListResponse.json();
}

export default async function ManagementPage() {
    const users = await getUsers();

    return <article className={managementstyle.wrapper}>
        <ManagementForm users={users} />
    </article>;
}