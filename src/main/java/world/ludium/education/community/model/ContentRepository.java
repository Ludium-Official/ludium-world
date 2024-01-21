package world.ludium.education.community.model;

import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.community.model.Content;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContentRepository extends JpaRepository<Content, UUID> {
    List<Content> findAllByOrderByCreateAt();

    Optional<Content> findTop1ByTypeOrderByCreateAtDesc(String string);
}
