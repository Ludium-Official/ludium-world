package world.ludium.education.article;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import world.ludium.education.course.Module;
import world.ludium.education.course.ModuleService;

import java.util.List;
import java.util.UUID;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final ModuleService moduleService;

    public ArticleService(ArticleRepository articleRepository,
                          ModuleService moduleService) {
        this.articleRepository = articleRepository;
        this.moduleService = moduleService;
    }

    public Article getArticle(UUID id) {
        return articleRepository.findByIdAndIsVisible(id, true).orElseThrow();
    }

    public void createArticle(Article article) {
        article.setId(UUID.randomUUID());

        articleRepository.save(article);
    }

    @Transactional
    public void createCourseWithModule(Article article, List<Module> modules) {
        article.setId(UUID.randomUUID());
        article.setCategory(Category.COURSE);

        articleRepository.save(article);
        for(Module module: modules) {
            module.setCategory(world.ludium.education.make.Category.MODULE);
            moduleService.createModule(module, article.getId());
        }
    }

    @Transactional
    public void createMake(Article makeTypeArticle, Module makeTypeModule, UUID moduleId) {
        makeTypeModule.setCategory(world.ludium.education.make.Category.MISSION);
        moduleService.createModule(makeTypeModule, moduleId);

        makeTypeArticle.setId(makeTypeModule.getId());

        articleRepository.save(makeTypeArticle);
    }

    public List<Article> getAllPost() { return articleRepository.findAllByCategoryAndIsVisibleOrderByOrderNoAsc(Category.FREE_BOARD, true); }

    public List<Article> getAllCourse() { return articleRepository.findAllByCategoryAndIsVisibleOrderByOrderNoAsc(Category.COURSE, true); }

    public List<Article> getAllMake() { return articleRepository.findAllByCategoryAndIsVisibleOrderByOrderNoAsc(Category.MAKE, true); }

    public List<Article> getAllMakeByUsrId(UUID usrId) { return articleRepository.findAllByUsrIdAndCategoryAndIsVisible(usrId, Category.MAKE ,true); }

    public List<Article> getAllApply() { return articleRepository.findAllByCategoryAndIsVisibleOrderByOrderNoAsc(Category.APPLY, true); }

    public List<ModuleReferenceArticleDTO> getAllMissionsAndArticles(UUID moduleId) {
        return articleRepository.getArtWithStatusAndFilter(moduleId);
    }

    public void deleteArticle(UUID articleId) {
        articleRepository.deleteById(articleId);
    }

    public Article updateArticle(Article article) {
        return articleRepository.save(article);
    }

    public Article getProviderApply(UUID providerApplyId) {
        return articleRepository.findByIdAndIsVisible(providerApplyId, true).orElseThrow();
    }

    public List<Article> getAllModule() {
        return articleRepository.findAllByCategoryAndIsVisibleOrderByOrderNoAsc(Category.MODULE, true);
    }

    public List<Article> getAllArticle(List<UUID> idList) {
        return articleRepository.findAllByIdInAndIsVisible(idList, true);
    }
}
