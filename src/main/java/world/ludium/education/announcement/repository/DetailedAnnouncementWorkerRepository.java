package world.ludium.education.announcement.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.announcement.model.DetailedAnnouncementWorker;
import world.ludium.education.announcement.model.DetailedAnnouncementWorkerId;

public interface DetailedAnnouncementWorkerRepository extends
    JpaRepository<DetailedAnnouncementWorker, DetailedAnnouncementWorkerId> {

  Optional<DetailedAnnouncementWorker> findByDetailIdAndRole(UUID detailedAnnouncementId,
      String role);
}
