package world.ludium.education.learning.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import world.ludium.education.learning.model.Learning;
import world.ludium.education.profile.LearningDTO;

import java.util.List;
import java.util.UUID;

public interface LearningRepository extends JpaRepository<Learning, UUID> {
    @Query(nativeQuery = true, value = """
            SELECT lp1.posting_id postingId, lp1.title, lp2.usr_id usrId, MIN(lp2.create_at) as createAt
              FROM learn_posting lp1,
                   (SELECT c.posting_id,
                           ms.usr_id,
                           ms.create_at
                     FROM mission_submit ms,
                          mission m,
                          curriculum c
                    WHERE ms.mission_id = m.mission_id AND m.curriculum_id = c.curriculum_id
                    UNION
                   SELECT c.posting_id,
                          as2.usr_id,
                          as2.create_at
                     FROM article_submit as2,
                          article a,
                          curriculum c
                    WHERE as2.article_id = a.article_id AND a.curriculum_id = c.curriculum_id) lp2
             WHERE lp1.posting_id = lp2.posting_id
               AND lp2.usr_id = :usrId
             GROUP BY lp1.posting_id, lp1.title, lp2.usr_id
             ORDER BY min(lp2.create_at)
        """)
    List<LearningDTO> getAllLearningDTOByUsrId(@Param("usrId") UUID usrId);
    List<Learning> findAllByOrderByCreateAt();
}
