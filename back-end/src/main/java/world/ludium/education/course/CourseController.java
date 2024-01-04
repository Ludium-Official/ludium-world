package world.ludium.education.course;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;
import world.ludium.education.article.Category;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/course", produces = "application/json")
public class CourseController {
    private LoginService loginService;
    private ArticleService articleService;
    private LudiumUserService ludiumUserService;
    private ModuleService moduleService;

    public CourseController(LoginService loginService,
                            ArticleService articleService,
                            LudiumUserService ludiumUserService,
                            ModuleService moduleService) {
        this.loginService = loginService;
        this.articleService = articleService;
        this.ludiumUserService = ludiumUserService;
        this.moduleService = moduleService;
    }

    @GetMapping("")
    public ResponseEntity getAllCourse() {
        return ResponseEntity.ok(articleService.getAllCourse());
    }

    @GetMapping("/{courseId}")
    public ResponseEntity getCourse(@PathVariable UUID courseId) {
        CourseDTO courseDTO = new CourseDTO();
        try {
            Article course = articleService.getArticle(courseId);
            List<Module> modules = moduleService.getAllModulesByCourse(courseId);

            courseDTO.setId(course.getId());
            courseDTO.setTitle(course.getTitle());
            courseDTO.setContent(course.getContent());
            courseDTO.setModules(null);
        } catch (Exception e) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<>() {{
                put("message", "수업을 불러오는 중에 에러가 발생했습니다.");
                put("debug", e.getMessage());
            }});
        }
        return ResponseEntity.ok(courseDTO);
    }

    @PostMapping("")
    public ResponseEntity createCourse(@RequestParam String title,
                                       @RequestParam String content,
                                       @RequestParam String modules,
                                       @CookieValue(name = "access_token", required = false) String accessToken) {
        JsonNode googleUserApiData = null;

        try {
            googleUserApiData = loginService.getUserResource(accessToken, "google");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "인증에 실패했습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }

        LudiumUser ludiumUser = ludiumUserService.getUser(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setUsrId(ludiumUser.getId());

        try {
            List<Module> moduleList = Arrays.stream(modules.split("\\|"))
                    .map(moduleTitle -> {
                        Module module = new Module();
                        module.setTitle(moduleTitle);
                        return module;
                    })
                    .collect(Collectors.toList());

            articleService.createCourseWithModule(article, moduleList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "수업을 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @GetMapping("/{courseId}/{moduleId}")
    public ResponseEntity getModule(@PathVariable UUID moduleId) {
        ModuleDTO moduleDTO = new ModuleDTO();

        try {
            Module module = moduleService.getModule(moduleId);
            List<ModuleReference> moduleReferences = moduleService.getAllModuleReferenceByModuleId(moduleId);

            moduleDTO.setId(moduleId);
            moduleDTO.setTitle(module.getTitle());
            moduleDTO.setContent(module.getContent());
            moduleDTO.setCategory(module.getCategory().toString());
            moduleDTO.setModuleReferences(moduleReferences);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "모듈을 불러오는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(moduleDTO);
    }

    @PutMapping("/{courseId}/module/{moduleId}")
    public ResponseEntity updateModule(@PathVariable UUID courseId,
                                       @PathVariable UUID moduleId,
                                       @RequestParam String title,
                                       @RequestParam String content,
                                       @RequestParam String category) {
        Module module = new Module();
        module.setId(moduleId);
        module.setTitle(title);
        module.setContent(content);
        module.setCategory(world.ludium.education.make.Category.valueOf(category));
        module.setCrsId(courseId);

        return ResponseEntity.ok(moduleService.updateModule(module));
    }

    @PutMapping("/{courseId}/{moduleId}/{articleId}")
    public ResponseEntity updateModuleReference(@PathVariable UUID moduleId,
                                                @PathVariable UUID articleId) {
        return ResponseEntity.ok(moduleService.updateModuleReference(moduleId, articleId));
    }

    @GetMapping("/missionAndArticles/{moduleId}")
    public ResponseEntity getMissionAndArticles(@PathVariable UUID moduleId) {
        return ResponseEntity.ok(articleService.getAllMissionsAndArticles(moduleId));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity deleteCourse(@PathVariable UUID courseId) {
        try {
            articleService.deleteArticle(courseId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "교육을 삭제 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }
        return ResponseEntity.ok(courseId);
    }

    @PutMapping("/{courseId}")
    public ResponseEntity updateCourse(@PathVariable UUID courseId,
                                       @RequestParam String title,
                                       @RequestParam String content,
                                       @CookieValue(name = "access_token", required = false) String accessToken) {
        JsonNode googleUserApiData = null;

        try {
            googleUserApiData = loginService.getUserResource(accessToken, "google");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "인증에 실패했습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }

        LudiumUser ludiumUser = ludiumUserService.getUser(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article article = new Article();
        article.setId(courseId);
        article.setTitle(title);
        article.setContent(content);
        article.setUsrId(ludiumUser.getId());
        article.setCategory(Category.COURSE);

        try {
            articleService.updateArticle(article);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "수업을 수정하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }
}
