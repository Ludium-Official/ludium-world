package world.ludium.education.profile.dto;

import java.sql.Timestamp;
import java.util.UUID;

public record MyApplicationDTO(UUID applicationId,
                               String title,
                               UUID detailId,
                               String role,
                               Timestamp createAt,
                               UUID postingId) {

}
