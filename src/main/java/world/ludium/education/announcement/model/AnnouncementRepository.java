package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    List<Announcement> findAllByOrderByIsPinnedDescPinOrderDescCreateAtDesc();
    List<Announcement> findTop5ByOrderByCreateAtDesc();
    Optional<Announcement> findTop1ByOrderByPinOrder();
}
