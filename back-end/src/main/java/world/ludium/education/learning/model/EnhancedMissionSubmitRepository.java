package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnhancedMissionSubmitRepository extends JpaRepository<EnhancedMissionSubmit, EnhancedMissionSubmitId> {
    List<EnhancedMissionSubmit> findAllByMissionIdOrderByCreateAt(UUID missionId);
    Optional<EnhancedMissionSubmit> findByMissionIdAndUsrId(UUID missionId, UUID usrId);

}