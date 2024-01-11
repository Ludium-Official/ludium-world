package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface CurriculumRepository extends JpaRepository<Curriculum, UUID> {
    List<Curriculum> findAllByPostingIdOrderByCreateAt(UUID learningId);

    @Query(nativeQuery = true, value = """
            SELECT mission_id id,
                   title,
                   description,
                   usr_id,
                   'MISSION' type,
                   create_at
              FROM mission
             WHERE curriculum_id = ?1
             UNION
            SELECT article_id id,
                   title,
                   description,
                   usr_id,
                   'ARTICLE' type,
                   create_at
              FROM article
             WHERE curriculum_id = ?1
             ORDER BY create_at
            """)
    List<Map<String, String>> findAllMissionAndArticle(UUID curriculumId);
}
