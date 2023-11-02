package world.ludium.education.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MissionSubmitRepository extends JpaRepository<MissionSubmit, UUID> {
    List<MissionSubmit> findAllByMsnId(UUID msnId);
    List<MissionSubmit> findAllByUsrId(UUID usrId);
}
