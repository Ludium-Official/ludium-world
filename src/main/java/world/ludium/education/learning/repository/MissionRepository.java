package world.ludium.education.learning.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import world.ludium.education.learning.model.Mission;
import world.ludium.education.profile.dto.MyMissionDTO;

public interface MissionRepository extends JpaRepository<Mission, UUID> {

  List<Mission> findAllByOrderByCreateAtDesc();

  List<Mission> findAllByCurriculumIdOrderByOrderNum(UUID curriculumId);

  @Query("""
      SELECT new world.ludium.education.profile.dto.MyMissionDTO(m.missionId,
                                                             m.title,
                                                             m.createAt,
                                                             ms.status,
                                                             c.postingId,
                                                             c.curriculumId,
                                                             m.rewardToken,
                                                             m.rewardAmount,
                                                             rc.rewardClaimStatus)
        FROM EnhancedMissionSubmit ms
        JOIN Mission m ON ms.missionId = m.missionId
        JOIN Curriculum c ON c.curriculumId = m.curriculumId
        LEFT JOIN RewardClaim rc ON rc.resourceId = m.missionId AND rc.userId = ms.usrId
       WHERE ms.usrId = :usrId
       ORDER BY ms.createAt
      """)
  List<MyMissionDTO> findAllByUsrIdOrderByCreateAt(@Param("usrId") UUID usrId);

  @Query("""
          SELECT new world.ludium.education.profile.dto.MyMissionDTO(m.missionId,
                                                                     m.title,
                                                                     m.createAt,
                                                                     ms.status,
                                                                     c.postingId,
                                                                     c.curriculumId,
                                                                     m.rewardToken,
                                                                     m.rewardAmount,
                                                                     rc.rewardClaimStatus)
            FROM EnhancedMissionSubmit ms
            JOIN Mission m ON ms.missionId = m.missionId
            JOIN Curriculum c ON c.curriculumId = m.curriculumId
            LEFT JOIN RewardClaim rc ON rc.resourceId = m.missionId AND rc.userId = ms.usrId
           WHERE ms.usrId = :usrId
           ORDER BY ms.createAt
      """)
  List<MyMissionDTO> findTop4ByUsrIdOrderByCreateAt(@Param("usrId") UUID usrId, Pageable pageable);
}
