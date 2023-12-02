import { getMission } from "../page";
import EditMissionForm from "./EditMissionForm";

export const metadata = {
    title: "미션 수정"
}

export default async function EditMissionPage({ params: { missionId } }) {
    const mission = await getMission(missionId);

    return <EditMissionForm {...mission} />;
}