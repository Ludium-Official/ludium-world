package world.ludium.education.community.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContentRecommendRepository extends JpaRepository<ContentRecommend, ContentRecommendId> {
    long countByContentId(UUID contentId);
}
