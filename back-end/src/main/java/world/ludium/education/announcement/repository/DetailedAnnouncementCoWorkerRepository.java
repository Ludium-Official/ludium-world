package world.ludium.education.announcement.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import world.ludium.education.announcement.dto.DetailedAnnouncementCoWorkerDTO;
import world.ludium.education.announcement.model.DetailedAnnouncementCoWorker;
import world.ludium.education.announcement.model.DetailedAnnouncementCoWorkerId;

public interface DetailedAnnouncementCoWorkerRepository extends
    JpaRepository<DetailedAnnouncementCoWorker, DetailedAnnouncementCoWorkerId> {

  @Query("""
      SELECT NEW world.ludium.education.announcement.dto.DetailedAnnouncementCoWorkerDTO(dpcw.detailId,
                                                                                           dpcw.usrId,
                                                                                           lu.nick
      )
        FROM DetailedAnnouncementCoWorker dpcw
        LEFT JOIN LudiumUser lu on dpcw.usrId = lu.id
       WHERE dpcw.detailId = :detailId
      """)
  List<DetailedAnnouncementCoWorkerDTO> findAllByDetailId(@Param("detailId") UUID detailId);
}
