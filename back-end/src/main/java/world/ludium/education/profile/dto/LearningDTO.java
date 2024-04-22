package world.ludium.education.profile.dto;

import java.sql.Timestamp;
import java.util.UUID;

public interface LearningDTO {

  UUID getPostingId();

  String getTitle();

  UUID getUsrId();

  Timestamp getCreateAt();
}
