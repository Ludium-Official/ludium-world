package world.ludium.education.announcement;

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
import world.ludium.education.course.*;
import world.ludium.education.course.Module;

import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/announcement", produces = "application/json")
public class AnnouncementController {
    private LoginService loginService;

    private final ArticleService articleService;
    private final LudiumUserService ludiumUserService;
    private final ModuleService moduleService;

    public AnnouncementController(LoginService loginService, ArticleService articleService, LudiumUserService ludiumUserService, ModuleService moduleService) {
        this.loginService = loginService;
        this.articleService = articleService;
        this.ludiumUserService = ludiumUserService;
        this.moduleService = moduleService;
    }

    @GetMapping("")
    public ResponseEntity getAllAnnouncement() {
        return ResponseEntity.ok(articleService.getAllAnnouncement());
    }

    @PostMapping("")
    public ResponseEntity createAnnouncement(@RequestParam String title,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article announcement = Article.Announcement();
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setUsrId(ludiumUser.getId());

        try {
            articleService.createArticle(announcement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "공고를 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @GetMapping("/{announcementId}")
    public ResponseEntity getAnnouncement(@PathVariable UUID announcementId) {
        var courseDTO = new CourseDTO();
        try {
            Article announce = articleService.getArticle(announcementId);
            var modules = moduleService.getAllModulesByCourse(announcementId)
                    .stream()
                    .map(module -> {
                        UUID moduleId = module.getId();

                        try {
                            return articleService.getArticle(moduleId);
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(module -> module != null)
                    .sorted(Comparator.comparingInt(Article::getOrderNo))
                    .collect(Collectors.toList());

            courseDTO.setId(announce.getId());
            courseDTO.setTitle(announce.getTitle());
            courseDTO.setContent(announce.getContent());
            courseDTO.setModules(modules);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<>() {{
                put("message", "수업을 불러오는 중에 에러가 발생했습니다.");
                put("debug", e.getMessage());
            }});
        }
        return ResponseEntity.ok(courseDTO);
    }

    @GetMapping("/{announcementId}/{moduleId}")
    public ResponseEntity getModule(@PathVariable UUID moduleId) {
        ModuleDTO moduleDTO = new ModuleDTO();

        try {
            Module module = moduleService.getModule(moduleId);
            List<ModuleReference> moduleReferences = moduleService.getAllModuleReferenceByModuleId(moduleId);

            moduleDTO.setId(moduleId);
            moduleDTO.setTitle(module.getTitle());
            moduleDTO.setContent(module.getContent());
            moduleDTO.setCategory(module.getCategory());
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

    @GetMapping("/{announcementId}/{moduleId}/make")
    public ResponseEntity getMake(@PathVariable UUID moduleId) {
        return ResponseEntity.ok(moduleService.getAllModulesByCourse(moduleId));
    }


    @PutMapping("/{announcementId}/module/{moduleId}")
    public ResponseEntity updateModule(@PathVariable UUID announcementId,
                                       @PathVariable UUID moduleId,
                                       @RequestParam String title,
                                       @RequestParam String content) {
        Module module = new Module();
        module.setId(moduleId);
        module.setTitle(title);
        module.setContent(content);
        module.setCategory("");
        module.setCrsId(announcementId);

        Article module2 = articleService.getArticle(moduleId);
        module2.setTitle(title);
        articleService.updateArticle(module2);

        return ResponseEntity.ok(moduleService.updateModule(module));
    }

    @PutMapping("/{announcementId}")
    public ResponseEntity updateAnnouncement(@PathVariable UUID announcementId,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article announcement = Article.Announcement();
        announcement.setId(announcementId);
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setUsrId(ludiumUser.getId());

        try {
            articleService.updateArticle(announcement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "공고를 수정하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @PostMapping("{announcementId}")
    public ResponseEntity createModule(@PathVariable UUID announcementId,
                                       @RequestParam String title,
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

        Article module1 = Article.Module();
        module1.setTitle(title);
        module1.setContent("");
        module1.setUsrId(ludiumUser.getId());

        Module module2 = new Module();
        module2.setTitle(title);

        try {
            articleService.createModule(module1, module2, announcementId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "모듈을 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", "");
        }});
    }

    @PostMapping("{announcementId}/{moduleId}")
    public ResponseEntity createModule(@PathVariable UUID announcementId,
                                       @PathVariable UUID moduleId,
                                       @RequestParam String title,
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

        Article make = Article.Make();
        make.setTitle(title);
        make.setContent("");
        make.setUsrId(ludiumUser.getId());

        Module module2 = new Module();
        module2.setTitle(title);

        try {
            articleService.createMake(make, module2, moduleId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "제작을 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", "");
        }});
    }

    @DeleteMapping("{announcementId}")
    public ResponseEntity disableAnnouncement(@PathVariable UUID announcementId) {
        var disabledAnnouncemen = articleService.getArticle(announcementId);

        disabledAnnouncemen.setVisible(false);
        try {
            articleService.updateArticle(disabledAnnouncemen);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("message", "공고를 비활성화하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(new HashMap<>() {{
            put("id", announcementId);
        }});
    }
}
