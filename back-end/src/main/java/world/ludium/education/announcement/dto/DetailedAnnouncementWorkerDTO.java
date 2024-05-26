package world.ludium.education.announcement.dto;

import java.util.UUID;
import world.ludium.education.announcement.model.DetailedAnnouncementWorker;
import world.ludium.education.auth.model.LudiumUser;

public record DetailedAnnouncementWorkerDTO(UUID detailId, UUID usrId, String nick, String role) {

  public DetailedAnnouncementWorkerDTO(DetailedAnnouncementWorker detailedAnnouncementWorker,
      LudiumUser ludiumUser) {
    this(detailedAnnouncementWorker.getDetailId(), detailedAnnouncementWorker.getUsrId(),
        ludiumUser.getNick(), detailedAnnouncementWorker.getRole());
  }
}
