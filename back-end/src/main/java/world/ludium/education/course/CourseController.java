package world.ludium.education.course;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;
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
    public ResponseEntity getPost(@PathVariable UUID courseId) {
       Article course = null;
       List<Module> modules = null;
       CourseDTO courseDTO = new CourseDTO();
        try {
            course = articleService.getArticle(courseId);
            modules = moduleService.getAllModulesByCourse(courseId);

            courseDTO.setId(course.getId());
            courseDTO.setTitle(course.getTitle());
            courseDTO.setContent(course.getContent());
            courseDTO.setModules(modules);
        } catch (Exception e) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new HashMap<>(){{
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setUsrId(ludiumUser.getId());

        try {
            List<Module> moduleList = Arrays.stream(modules.split("\\|"))
                    .map(moduleTitle -> {
                        Module module = new Module();
                        module.setTitle(moduleTitle);
                        return module;})
                    .collect(Collectors.toList());

            articleService.createCourseWithModule(article, moduleList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "아티클을 만드는 중에 에러가 발생했습니다.");
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
