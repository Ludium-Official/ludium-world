package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MissionRepository extends JpaRepository<Mission, UUID> {
    List<Mission> findAllByCurriculumIdOrderByCreateAt(UUID curriculumId);
}
