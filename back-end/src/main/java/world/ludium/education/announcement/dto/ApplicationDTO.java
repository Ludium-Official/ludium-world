package world.ludium.education.announcement.dto;

import java.util.UUID;
import world.ludium.education.announcement.model.Application;
import world.ludium.education.auth.model.LudiumUser;

public record ApplicationDTO(UUID applicationId, String title, String description, UUID detailId,
                             UUID usrId, String nick, String role) {

  public ApplicationDTO(Application application, LudiumUser ludiumUser) {
    this(application.getApplicationId(),
        application.getTitle(),
        application.getDescription(),
        application.getDetailId(),
        application.getUsrId(),
        ludiumUser.getNick(),
        application.getRole());
  }
}
