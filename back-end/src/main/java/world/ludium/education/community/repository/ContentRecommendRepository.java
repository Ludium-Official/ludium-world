package world.ludium.education.community.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.community.model.ContentRecommend;
import world.ludium.education.community.model.ContentRecommendId;

public interface ContentRecommendRepository extends
    JpaRepository<ContentRecommend, ContentRecommendId> {

  long countByContentId(UUID contentId);
}
