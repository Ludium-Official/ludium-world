package world.ludium.education.article;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticle() {
        return articleRepository.findAll();
    }

    public Article getArticle(UUID id) {
        return articleRepository.findById(id).orElse(null);
    }

    public Article createArticle(Article article) {
        article.setId(UUID.randomUUID());

        return articleRepository.save(article);
    }

    public List<Article> getAllArticlesByUsrId(UUID usrId) {
        return articleRepository.findAllByUsrId(usrId);
    }
}
