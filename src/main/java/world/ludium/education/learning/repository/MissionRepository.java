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
                                                             c.curriculumId,
                                                             c.postingId)
        FROM EnhancedMissionSubmit ms
           , Mission m
           , Curriculum c
       WHERE ms.missionId = m.missionId
         AND m.curriculumId = c.curriculumId
         AND ms.usrId = :usrId
       ORDER BY ms.createAt
      """)
  List<MyMissionDTO> findAllByUsrIdOrderByCreateAt(@Param("usrId") UUID usrId);

  @Query("""
      SELECT new world.ludium.education.profile.dto.MyMissionDTO(m.missionId,
                                                             m.title,
                                                             m.createAt,
                                                             ms.status,
                                                             c.curriculumId,
                                                             c.postingId)
        FROM EnhancedMissionSubmit ms
           , Mission m
           , Curriculum c
       WHERE ms.missionId = m.missionId
         AND m.curriculumId = c.curriculumId
         AND ms.usrId = :usrId
       ORDER BY ms.createAt
      """)
  List<MyMissionDTO> findTop4ByUsrIdOrderByCreateAt(@Param("usrId") UUID usrId, Pageable pageable);
}
