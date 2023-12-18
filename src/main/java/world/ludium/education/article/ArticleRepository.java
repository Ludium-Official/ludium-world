package world.ludium.education.article;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    List<Article> findAllByUsrIdAndIsVisible(UUID UsrId, boolean visibility);
    List<Article> findAllByCategoryAndIsVisibleOrderByOrderNoAsc(Category category, boolean visibility);

    List<Article> findAllByCategoryIn(List<Category> categoryList);

    @Query("""
            SELECT NEW world.ludium.education.article.ModuleReferenceArticleDTO(a.id,
                                                                                a.title,
                                                                                a.content,
                                                                                a.usrId,
                                                                                a.category,
                                                                                CASE WHEN mr.mdlId IS NOT NULL THEN true ELSE false END)
              FROM Article a
              LEFT JOIN ModuleReference mr
                ON a.id = mr.artId
               AND mr.mdlId = :mdlId
             WHERE a.category IN ('MISSION', 'ARTICLE')
            """)
    List<ModuleReferenceArticleDTO> getArtWithStatusAndFilter(@Param("mdlId") UUID mdlId);

    Optional<Article> findByCategory(Category category);

    Optional<Article> findByCategoryAndUsrId(Category category, UUID usrId);

    Optional<Article> findByIdAndIsVisible(UUID id, boolean visibility);

    List<Article> findAllByIdInAndIsVisible(List<UUID> id, boolean visibility);
}
