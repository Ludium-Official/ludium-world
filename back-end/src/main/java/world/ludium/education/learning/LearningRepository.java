package world.ludium.education.learning;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LearningRepository extends JpaRepository<Learning, UUID> {
    List<Learning> findAllByOrderByCreateAt();
}
