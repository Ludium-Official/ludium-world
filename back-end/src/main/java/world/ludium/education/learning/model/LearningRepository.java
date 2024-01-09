package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.learning.model.Learning;

import java.util.List;
import java.util.UUID;

public interface LearningRepository extends JpaRepository<Learning, UUID> {
    List<Learning> findAllByOrderByCreateAt();
}
