package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DetailedAnnouncementWorkerRepository extends JpaRepository<DetailedAnnouncementWorker, DetailedAnnouncementWorkerId> {
    Optional<DetailedAnnouncementWorker> findByDetailIdAndRole(UUID detailedAnnouncementId, String role);
}
