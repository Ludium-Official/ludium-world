package world.ludium.education.community.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.community.model.ContentComment;
import world.ludium.education.community.model.ContentCommentId;

public interface ContentCommentRepository extends JpaRepository<ContentComment, ContentCommentId> {

  List<ContentComment> findAllByContentIdOrderByCreateAt(UUID contentId);
}
