package world.ludium.education.announcement.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import world.ludium.education.announcement.model.DetailedAnnouncement;

public interface DetailedAnnouncementRepository extends JpaRepository<DetailedAnnouncement, UUID> {

  List<DetailedAnnouncement> findAllByOrderByIsPinnedDescPinOrderDescCreateAtAsc();

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

  @Query("""
      SELECT dp
        FROM DetailedAnnouncementWorker dpw
           , DetailedAnnouncement dp
       WHERE dpw.detailId = dp.detailId
         AND dpw.usrId = :usrId
       ORDER BY dp.createAt
      """)
  List<DetailedAnnouncement> findTop4ByWorkerOrderByCreateAt(@Param("usrId") UUID usrId,
      Pageable pageable);

  Optional<DetailedAnnouncement> findTop1ByOrderByPinOrder();
}
