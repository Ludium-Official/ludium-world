package world.ludium.education.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EnhancedMissionSubmitCommentRepository extends JpaRepository<EnhancedMissionSubmitComment, EnhancedMissionSubmitCommentId> {
    List<EnhancedMissionSubmitComment> findAllByMissionIdAndUsrIdOrderByCreateAt(UUID missionId, UUID usrId);
}
