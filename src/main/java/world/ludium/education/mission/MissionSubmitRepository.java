package world.ludium.education.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MissionSubmitRepository extends JpaRepository<MissionSubmit, UUID> {

}
