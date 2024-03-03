package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface DetailedAnnouncementCoWorkerRepository extends JpaRepository<DetailedAnnouncementCoWorker, DetailedAnnouncementCoWorkerId> {
    @Query("""
            SELECT NEW world.ludium.education.announcement.model.DetailedAnnouncementCoWorkerDTO(dpcw.detailId,
                                                                                                 dpcw.usrId,
                                                                                                 lu.nick
            )
              FROM DetailedAnnouncementCoWorker dpcw
              LEFT JOIN LudiumUser lu on dpcw.usrId = lu.id
             WHERE dpcw.detailId = :detailId
            """)
    List<DetailedAnnouncementCoWorkerDTO> findAllByDetailId(@Param("detailId") UUID detailId);
}
