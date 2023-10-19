package world.ludium.education.announcement.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.announcement.model.DetailedAnnouncementContent;

public interface DetailedAnnouncementContentRepository extends
    JpaRepository<DetailedAnnouncementContent, UUID> {

  List<DetailedAnnouncementContent> findAllByDetailIdOrderByCreateAt(UUID detailId);

  List<DetailedAnnouncementContent> findAllByDetailIdAndStatusOrderByCreateAt(UUID detailId,
      String status);
}
