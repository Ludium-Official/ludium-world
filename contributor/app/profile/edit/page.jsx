import { getProfile } from "../page";
import EditProfile from "./EditProfile";

export const metadata = {
  title: "내 정보 수정"
}

export default async function EditProfilePage() {
  const profile = await getProfile();

  return <div>
    <EditProfile profile={profile} />
  </div>
}