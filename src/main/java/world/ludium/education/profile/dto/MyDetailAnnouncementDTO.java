package world.ludium.education.profile.dto;

import java.sql.Timestamp;
import java.util.UUID;

public record MyDetailAnnouncementDTO(UUID detailId,
                                      String title,
                                      Timestamp createAt,
                                      String status,
                                      UUID rewardToken,
                                      Double rewardAmount,
                                      String rewardClaimStatus) {
}
