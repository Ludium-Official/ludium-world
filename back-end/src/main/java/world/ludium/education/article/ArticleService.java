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
        return articleRepository.findAllByCategoryAndIsVisible(Category.ARTICLE, true);
    }

    public Article getArticle(UUID id) {
        return articleRepository.findByIdAndIsVisible(id, true).orElseThrow();
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
    public void createModule(Article moduleTypeArticle, Module module, UUID announcementId) {
            moduleService.createModule(module, announcementId);

            moduleTypeArticle.setId(module.getId());

            articleRepository.save(moduleTypeArticle);
    }

    public List<Article> getAllArticlesByUsrId(UUID usrId) {
        return articleRepository.findAllByUsrIdAndIsVisible(usrId, true);
    }

    public List<Article> getAllMission() { return articleRepository.findAllByCategoryAndIsVisible(Category.MISSION, true); }

    public List<Article> getAllPost() { return articleRepository.findAllByCategoryAndIsVisible(Category.FREE_BOARD, true); }

    public List<Article> getAllCourse() { return articleRepository.findAllByCategoryAndIsVisible(Category.COURSE, true); }

    public List<Article> getAllAnnouncement() { return articleRepository.findAllByCategoryAndIsVisible(Category.ANNOUNCEMENT, true); }

    public List<Article> getAllMake() { return articleRepository.findAllByCategoryAndIsVisible(Category.MAKE, true); }

    public List<Article> getAllMissionsAndArticles() { return articleRepository.findAllByCategoryIn(Arrays.asList(Category.MISSION, Category.ARTICLE)); }

    public List<Article> getAllApply() { return articleRepository.findAllByCategoryAndIsVisible(Category.APPLY, true); }

    public List<ModuleReferenceArticleDTO> getAllMissionsAndArticles(UUID moduleId) {
        return articleRepository.getArtWithStatusAndFilter(moduleId);
    }

    public void deleteArticle(UUID articleId) {
        articleRepository.deleteById(articleId);
    }

    public Article updateArticle(Article article) {
        return articleRepository.save(article);
    }

    public Article getProviderApplyByUsrId(UUID usrId) {
        return articleRepository.findByCategoryAndUsrId(Category.PROVIDER_APPLY, usrId).orElseThrow();
    }

    public List<Article> getAllProviderApply() {
        return articleRepository.findAllByCategoryAndIsVisible(Category.PROVIDER_APPLY, true);
    }

    public Article getProviderApply(UUID providerApplyId) {
        return articleRepository.findByIdAndIsVisible(providerApplyId, true).orElseThrow();
    }

    public List<Article> getAllModule() {
        return articleRepository.findAllByCategoryAndIsVisible(Category.MODULE, true);
    }
}
