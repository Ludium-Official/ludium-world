package world.ludium.education.learning;

import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class EnhancedArticleService {
    private final EnhancedArticleRepository enhancedArticleRepository;
    private final ArticleSubmitRepository articleSubmitRepository;

    public EnhancedArticleService(EnhancedArticleRepository enhancedArticleRepository,
                                  ArticleSubmitRepository articleSubmitRepository) {
        this.enhancedArticleRepository = enhancedArticleRepository;
        this.articleSubmitRepository = articleSubmitRepository;
    }

    public List<EnhancedArticle> getAllArticle(UUID curriculumId) {
        return enhancedArticleRepository.findAllByCurriculumIdOrderByCreateAt(curriculumId);
    }

    public EnhancedArticle getArticle(UUID articleId) {
        return enhancedArticleRepository.findById(articleId).orElseThrow();
    }

    public EnhancedArticle createArticle(EnhancedArticle enhancedArticle) {
        enhancedArticle.setArticleId(UUID.randomUUID());
        enhancedArticle.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return enhancedArticleRepository.save(enhancedArticle);
    }

    public EnhancedArticle updateArticle(EnhancedArticle enhancedArticle) {
        return enhancedArticleRepository.save(enhancedArticle);
    }

    public boolean isExistArticleSubmit(UUID articleId, UUID usrId) {
        var articleSubmitId = new ArticleSubmitId();

        articleSubmitId.setArticleId(articleId);
        articleSubmitId.setUsrId(usrId);

        return articleSubmitRepository.existsById(articleSubmitId);
    }

    public ArticleSubmit createArticleSubmit(ArticleSubmit articleSubmit) {
        articleSubmit.setCreateAt(new Timestamp(System.currentTimeMillis()));
        articleSubmit.setStatus(ArticleSubmitStatus.COMPLETE.toString());

        return articleSubmitRepository.save(articleSubmit);
    }

    public ArticleSubmit getArticleSubmit(UUID articleId, UUID usrId) {
        var articleSubmitId = new ArticleSubmitId();
        articleSubmitId.setArticleId(articleId);
        articleSubmitId.setUsrId(usrId);

        return articleSubmitRepository.findById(articleSubmitId).orElseThrow();
    }
}
