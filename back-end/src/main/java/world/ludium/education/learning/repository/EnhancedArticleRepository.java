package world.ludium.education.learning.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.learning.model.EnhancedArticle;

public interface EnhancedArticleRepository extends JpaRepository<EnhancedArticle, UUID> {

  List<EnhancedArticle> findAllByCurriculumIdOrderByOrderNum(UUID curriculumId);
}
