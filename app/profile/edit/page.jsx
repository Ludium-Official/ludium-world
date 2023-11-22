import { getProfile } from "../page";
import EditProfile from "./EditProfile";

export default async function EditProfilePage() {
    const profile = await getProfile();
    
    return <div>
    <h1>내 정보 수정하기</h1>
    <EditProfile profile={profile} />
  </div>
}