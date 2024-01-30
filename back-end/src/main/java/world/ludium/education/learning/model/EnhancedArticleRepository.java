package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EnhancedArticleRepository extends JpaRepository<EnhancedArticle, UUID> {
    List<EnhancedArticle> findAllByCurriculumIdOrderByOrderNum(UUID curriculumId);
}
