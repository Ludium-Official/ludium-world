package world.ludium.education.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MissionSubmitHistoryRepository extends JpaRepository<MissionSubmitHistory, UUID> {
    List<MissionSubmitHistory> findAllByMsnSbmId(UUID msnSbmId);
}
