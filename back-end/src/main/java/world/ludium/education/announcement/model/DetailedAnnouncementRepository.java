package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface DetailedAnnouncementRepository extends JpaRepository<DetailedAnnouncement, UUID> {
    List<DetailedAnnouncement> findAllByOrderByCreateAtAsc();
    List<DetailedAnnouncement> findAllByPostingIdOrderByCreateAt(UUID postingId);

    @Query("""
            SELECT dp
              FROM DetailedAnnouncementWorker dpw
                 , DetailedAnnouncement dp
             WHERE dpw.detailId = dp.detailId
               AND dpw.usrId = :usrId
             ORDER BY dp.createAt
            """)
    List<DetailedAnnouncement> findAllByWorkerOrderByCreateAt(@Param("usrId") UUID usrId);
}
