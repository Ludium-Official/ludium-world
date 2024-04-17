package world.ludium.education.profile.dto;

import java.sql.Timestamp;
import java.util.UUID;

public record MyMissionDTO(UUID missionId,
                           String title,
                           Timestamp createAt,
                           String status,
                           UUID postingId,
                           UUID curriculumId) {

}
