package world.ludium.education.announcement.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import world.ludium.education.announcement.model.DetailedAnnouncement;
import world.ludium.education.profile.dto.MyDetailAnnouncementDTO;

public interface DetailedAnnouncementRepository extends JpaRepository<DetailedAnnouncement, UUID> {

  List<DetailedAnnouncement> findAllByOrderByIsPinnedDescPinOrderDescCreateAtAsc();

  List<DetailedAnnouncement> findAllByPostingIdOrderByCreateAt(UUID postingId);

  @Query("""
      SELECT new world.ludium.education.profile.dto.MyDetailAnnouncementDTO(dp.detailId,
                                                                            dp.title,
                                                                            dp.createAt,
                                                                            dp.status,
                                                                            dp.rewardToken,
                                                                            dp.rewardAmount,
                                                                            rc.rewardClaimStatus)
        FROM DetailedAnnouncementWorker dpw
        JOIN DetailedAnnouncement dp ON dpw.detailId = dp.detailId
        LEFT JOIN RewardClaim rc ON rc.resourceId = dp.detailId
       WHERE dpw.usrId = :usrId
       ORDER BY dp.createAt
      """)
  List<MyDetailAnnouncementDTO> findAllByWorkerOrderByCreateAt(@Param("usrId") UUID usrId);

  @Query("""
      SELECT new world.ludium.education.profile.dto.MyDetailAnnouncementDTO(dp.detailId,
                                                                            dp.title,
                                                                            dp.createAt,
                                                                            dp.status,
                                                                            dp.rewardToken,
                                                                            dp.rewardAmount,
                                                                            rc.rewardClaimStatus)
        FROM DetailedAnnouncementWorker dpw
        JOIN DetailedAnnouncement dp ON dpw.detailId = dp.detailId
        LEFT JOIN RewardClaim rc ON rc.resourceId = dp.detailId
       WHERE dpw.usrId = :usrId
       ORDER BY dp.createAt
      """)
  List<MyDetailAnnouncementDTO> findTop4ByWorkerOrderByCreateAt(@Param("usrId") UUID usrId,
                                                                Pageable pageable);

  Optional<DetailedAnnouncement> findTop1ByOrderByPinOrder();
}
