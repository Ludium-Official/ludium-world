package world.ludium.education.announcement.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.announcement.model.DetailedAnnouncementContentComment;

public interface DetailedAnnouncementContentCommentRepository extends
    JpaRepository<DetailedAnnouncementContentComment, UUID> {

  List<DetailedAnnouncementContentComment> findAllByDetailedContentIdOrderByCreateAt(
      UUID detailedContentId);
}
