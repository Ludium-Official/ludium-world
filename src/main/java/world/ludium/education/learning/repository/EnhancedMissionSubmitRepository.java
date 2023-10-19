package world.ludium.education.learning.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.learning.model.EnhancedMissionSubmit;
import world.ludium.education.learning.model.EnhancedMissionSubmitId;

public interface EnhancedMissionSubmitRepository extends
    JpaRepository<EnhancedMissionSubmit, EnhancedMissionSubmitId> {

  List<EnhancedMissionSubmit> findAllByMissionIdOrderByCreateAt(UUID missionId);

  Optional<EnhancedMissionSubmit> findByMissionIdAndUsrId(UUID missionId, UUID usrId);

}