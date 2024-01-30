package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import world.ludium.education.profile.MyMissionDTO;

import java.util.List;
import java.util.UUID;

public interface MissionRepository extends JpaRepository<Mission, UUID> {
    List<Mission> findAllByOrderByCreateAt();
    List<Mission> findAllByCurriculumIdOrderByOrderNum(UUID curriculumId);

    @Query("""
            SELECT new world.ludium.education.profile.MyMissionDTO(m.missionId,
                                                                   m.title,
                                                                   m.createAt,
                                                                   ms.status,
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
}
