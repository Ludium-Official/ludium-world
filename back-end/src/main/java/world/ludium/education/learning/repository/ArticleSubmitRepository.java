package world.ludium.education.learning.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.learning.model.ArticleSubmit;
import world.ludium.education.learning.model.ArticleSubmitId;

public interface ArticleSubmitRepository extends JpaRepository<ArticleSubmit, ArticleSubmitId> {

}
