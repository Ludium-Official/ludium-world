import ManagementForm from "./ManagementForm";
import managementstyle from "./management.module.css";
import fetchWithRetry from "@/functions/api";

export const metadata = {
  title: "사용자 관리",
};

async function getUsers() {
  const getUserListResponse = await fetchWithRetry("/user");

  if (!getUserListResponse.ok) {
    return [];
  }

  return await getUserListResponse.json();
}

export default async function ManagementPage() {
  const users = await getUsers();

  return (
    <article className={managementstyle.wrapper}>
      <ManagementForm users={users} />
    </article>
  );
}
