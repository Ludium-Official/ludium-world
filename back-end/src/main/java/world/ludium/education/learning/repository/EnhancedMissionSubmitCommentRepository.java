package world.ludium.education.learning.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.learning.model.EnhancedMissionSubmitComment;
import world.ludium.education.learning.model.EnhancedMissionSubmitCommentId;

public interface EnhancedMissionSubmitCommentRepository extends
    JpaRepository<EnhancedMissionSubmitComment, EnhancedMissionSubmitCommentId> {

  List<EnhancedMissionSubmitComment> findAllByMissionIdAndUsrIdOrderByCreateAt(UUID missionId,
      UUID usrId);
}
