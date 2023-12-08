package world.ludium.education.article;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import world.ludium.education.course.Module;
import world.ludium.education.course.ModuleService;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;
    private ModuleService moduleService;

    public ArticleService(ArticleRepository articleRepository,
                          ModuleService moduleService) {
        this.articleRepository = articleRepository;
        this.moduleService = moduleService;
    }

    public List<Article> getAllArticle() {
        return articleRepository.findAllByCategory(Category.ARTICLE);
    }

    public Article getArticle(UUID id) {
        return articleRepository.findById(id).orElseThrow();
    }

    public Article createArticle(Article article) {
        article.setId(UUID.randomUUID());

        return articleRepository.save(article);
    }

    @Transactional
    public void createCourseWithModule(Article article, List<Module> modules) {
        article.setId(UUID.randomUUID());
        article.setCategory(Category.COURSE);

        articleRepository.save(article);
        for(Module module: modules) {
            moduleService.createModule(module, article.getId());
        }
    }

    @Transactional
    public void createAnnouncementWithModule(Article article, List<Module> modules) {
        article.setId(UUID.randomUUID());
        article.setCategory(Category.ANNOUNCEMENT);

        articleRepository.save(article);
        for(Module module: modules) {
            moduleService.createModule(module, article.getId());
        }
    }

    public List<Article> getAllArticlesByUsrId(UUID usrId) {
        return articleRepository.findAllByUsrId(usrId);
    }

    public List<Article> getAllMission() { return articleRepository.findAllByCategory(Category.MISSION); }

    public List<Article> getAllPost() { return articleRepository.findAllByCategory(Category.FREE_BOARD); }

    public List<Article> getAllCourse() { return articleRepository.findAllByCategory(Category.COURSE); }

    public List<Article> getAllAnnouncement() { return articleRepository.findAllByCategory(Category.ANNOUNCEMENT); }

    public List<Article> getAllMissionsAndArticles() { return articleRepository.findAllByCategoryIn(Arrays.asList(Category.MISSION, Category.ARTICLE)); }

    public List<ModuleReferenceArticleDTO> getAllMissionsAndArticles(UUID moduleId) {
        return articleRepository.getArtWithStatusAndFilter(moduleId);
    }

    public void deleteArticle(UUID articleId) {
        articleRepository.deleteById(articleId);
    }

    public Article updateArticle(Article article) {
        return articleRepository.save(article);
    }
}
