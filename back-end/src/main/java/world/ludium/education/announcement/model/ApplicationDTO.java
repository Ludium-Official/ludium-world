package world.ludium.education.announcement.model;

import org.springframework.beans.factory.annotation.Autowired;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;

import java.util.UUID;

public record ApplicationDTO(UUID applicationId, String title, String description, UUID detailId, UUID usrId, String nick, String role) {
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
