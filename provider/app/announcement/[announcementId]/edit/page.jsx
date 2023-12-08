import { getAnnouncement } from "../page"
import EditAnnouncement from "./EditAnnouncement";

export const metadata = {
    title: "공고 수정"
}

export default async function EditAnnouncementPage({ params: { announcementId } }) {
    const announcement = await getAnnouncement(announcementId);

    return <EditAnnouncement {...announcement} />
}