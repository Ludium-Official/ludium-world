package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DetailedAnnouncementRepository extends JpaRepository<DetailedAnnouncement, UUID> {
    List<DetailedAnnouncement> findAllByOrderByCreateAtAsc();
    List<DetailedAnnouncement> findAllByPostingIdOrderByCreateAt(UUID postingId);
}
