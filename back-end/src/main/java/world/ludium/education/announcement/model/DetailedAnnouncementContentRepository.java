package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DetailedAnnouncementContentRepository extends JpaRepository<DetailedAnnouncementContent, UUID> {
    List<DetailedAnnouncementContent> findAllByDetailIdOrderByCreateAt(UUID detailId);
    List<DetailedAnnouncementContent> findAllByDetailIdAndStatusOrderByCreateAt(UUID detailId, String status);
}
