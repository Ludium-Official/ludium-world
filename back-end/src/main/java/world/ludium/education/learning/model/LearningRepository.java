package world.ludium.education.learning.model;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    List<LearningDTO> getTop4LearningDTOByUsrId(@Param("usrId") UUID usrId, Pageable pageable);
    List<Learning> findAllByOrderByCreateAtDesc();

    List<Learning> findTop5ByOrderByCreateAtDesc();

    @Query(nativeQuery = true, value= """
            SELECT c.title curriculum, m.title mission, tlu.nick nick, ms.usr_id usrId
              FROM curriculum c
              LEFT JOIN mission m
                ON c.curriculum_id = m.curriculum_id
              LEFT JOIN mission_Submit ms
                ON ms.mission_id = m.mission_id
              LEFT JOIN tb_ldm_usr tlu
                ON tlu.id = ms.usr_id
             WHERE c.posting_id = :learningId
             GROUP BY c.title, m.title, ms.usr_id, c.order_num, m.order_num, tlu.nick
             ORDER BY c.order_num, m.order_num
            """)
    List<LearnMonitorDTO> findAllLearningMonitor(@Param("learningId") UUID learningId);
}
