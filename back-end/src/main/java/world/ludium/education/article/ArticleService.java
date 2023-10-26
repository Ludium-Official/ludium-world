package world.ludium.education.article;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Article createArticle(Article article) {
        article.setId(UUID.randomUUID());

        return articleRepository.save(article);
    }
}
