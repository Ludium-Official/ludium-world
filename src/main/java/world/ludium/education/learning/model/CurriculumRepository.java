package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CurriculumRepository extends JpaRepository<Curriculum, UUID> {
    List<Curriculum> findAllByPostingIdOrderByCreateAt(UUID learningId);
}
