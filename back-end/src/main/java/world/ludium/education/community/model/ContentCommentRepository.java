package world.ludium.education.community.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContentCommentRepository extends JpaRepository<ContentComment, ContentCommentId> {
    List<ContentComment> findAllByContentIdOrderByCreateAt(UUID contentId);
}
