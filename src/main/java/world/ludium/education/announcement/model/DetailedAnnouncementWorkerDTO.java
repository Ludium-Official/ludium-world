package world.ludium.education.announcement.model;

import jakarta.persistence.Id;
import world.ludium.education.auth.ludium.LudiumUser;

import java.util.UUID;

public record DetailedAnnouncementWorkerDTO(UUID detailId, UUID usrId, String nick, String role) {
    public DetailedAnnouncementWorkerDTO(DetailedAnnouncementWorker detailedAnnouncementWorker, LudiumUser ludiumUser) {
        this(detailedAnnouncementWorker.getDetailId(), detailedAnnouncementWorker.getUsrId(), ludiumUser.getNick(), detailedAnnouncementWorker.getRole());
    }
}
