package world.ludium.education.learning.repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import world.ludium.education.learning.model.Curriculum;

public interface CurriculumRepository extends JpaRepository<Curriculum, UUID> {

  List<Curriculum> findAllByPostingIdOrderByOrderNum(UUID learningId);

  @Query(nativeQuery = true, value = """
      SELECT mission_id id,
             title,
             description,
             usr_id,
             'MISSION' type,
             create_at,
             order_num
        FROM mission
       WHERE curriculum_id = ?1
       UNION
      SELECT article_id id,
             title,
             description,
             usr_id,
             'ARTICLE' type,
             create_at,
             order_num
        FROM article
       WHERE curriculum_id = ?1
       ORDER BY order_num, create_at
      """)
  List<Map<String, String>> findAllMissionAndArticle(UUID curriculumId);
}
