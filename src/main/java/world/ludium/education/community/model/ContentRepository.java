package world.ludium.education.community.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContentRepository extends JpaRepository<Content, UUID> {
    List<Content> findAllByVisibleOrderByCreateAt(boolean visible);

    Optional<Content> findByContentIdAndVisible(UUID id, boolean visible);
    Optional<Content> findTop1ByTypeAndVisibleOrderByCreateAtDesc(String string, boolean visible);
}
