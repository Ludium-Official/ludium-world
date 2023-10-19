package world.ludium.education.community.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.community.model.Content;

public interface ContentRepository extends JpaRepository<Content, UUID> {

  List<Content> findAllByVisibleOrderByIsPinnedDescPinOrderDescCreateAtDesc(boolean visible);

  Optional<Content> findByContentIdAndVisible(UUID id, boolean visible);

  Optional<Content> findTop1ByTypeAndVisibleOrderByCreateAtDesc(String string, boolean visible);

  Optional<Content> findTop1ByVisibleOrderByPinOrder(boolean visible);
}
