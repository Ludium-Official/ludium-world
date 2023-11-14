package world.ludium.education.article;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    List<Article> findAllByUsrId(UUID UsrId);
    List<Article> findAllByCategory(Category category);
}
