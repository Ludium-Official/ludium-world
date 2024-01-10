package world.ludium.education.learning;

import org.springframework.stereotype.Service;
import world.ludium.education.learning.model.EnhancedArticle;
import world.ludium.education.learning.model.EnhancedArticleRepository;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class EnhancedArticleService {
    private final EnhancedArticleRepository enhancedArticleRepository;

    public EnhancedArticleService(EnhancedArticleRepository enhancedArticleRepository) {
        this.enhancedArticleRepository = enhancedArticleRepository;
    }

    public List<EnhancedArticle> getAllArticle(UUID curriculumId) {
        return enhancedArticleRepository.findAllByCurriculumIdOrderByCreateAt(curriculumId);
    }

    public EnhancedArticle createArticle(EnhancedArticle enhancedArticle) {
        enhancedArticle.setArticleId(UUID.randomUUID());
        enhancedArticle.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return enhancedArticleRepository.save(enhancedArticle);
    }

    public EnhancedArticle updateArticle(EnhancedArticle enhancedArticle) {
        return enhancedArticleRepository.save(enhancedArticle);
    }
}
