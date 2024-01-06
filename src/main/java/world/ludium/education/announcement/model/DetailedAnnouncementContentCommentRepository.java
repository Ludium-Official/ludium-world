package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DetailedAnnouncementContentCommentRepository extends JpaRepository<DetailedAnnouncementContentComment, UUID> {
    List<DetailedAnnouncementContentComment> findAllByDetailedContentIdOrderByCreateAt(UUID detailedContentId);
}
