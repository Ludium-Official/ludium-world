package world.ludium.education.announcement;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.announcement.model.Announcement;
import world.ludium.education.announcement.model.DetailedAnnouncement;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.course.Module;
import world.ludium.education.course.*;
import world.ludium.education.make.Category;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/announcement", produces = "application/json")
public class AnnouncementController {
    private LoginService loginService;

    private final ArticleService articleService;
    private final LudiumUserService ludiumUserService;
    private final ModuleService moduleService;

    private final AnnouncementService announcementService;
    private final DetailedAnnouncementService detailedAnnouncementService;

    public AnnouncementController(LoginService loginService,
                                  ArticleService articleService,
                                  LudiumUserService ludiumUserService,
                                  ModuleService moduleService,
                                  AnnouncementService announcementService,
                                  DetailedAnnouncementService detailedAnnouncementService) {
        this.loginService = loginService;
        this.articleService = articleService;
        this.ludiumUserService = ludiumUserService;
        this.moduleService = moduleService;
        this.announcementService = announcementService;
        this.detailedAnnouncementService = detailedAnnouncementService;
    }

    @GetMapping("")
    public ResponseEntity<List<Announcement>> getAllAnnouncement() {
        return ResponseEntity.ok(announcementService.getAllAnnouncement());
    }

    @GetMapping("/{announcementId}")
    public ResponseEntity<Announcement> getAnnouncement(@PathVariable UUID announcementId) {
        return ResponseEntity.ok(announcementService.getAnnouncement(announcementId).orElseThrow());
    }

    @GetMapping("/{announcementId}/detail")
    public ResponseEntity<List<DetailedAnnouncement>> getAllDetailedAnnouncementByAnnouncement(@PathVariable UUID announcementId) {
        return ResponseEntity.ok(detailedAnnouncementService.getAllDetailedAnnouncementByAnnouncement(announcementId));
    }

    @GetMapping("/{announcementId}/{detailedAnnouncementId}")
    public ResponseEntity<DetailedAnnouncement> getDetailedAnnouncement(@PathVariable UUID detailedAnnouncementId) {
        return ResponseEntity.ok(detailedAnnouncementService.getDetailedAnnouncement(detailedAnnouncementId).orElseThrow());
    }

    @PostMapping("")
    public ResponseEntity<Object> createAnnouncement(@RequestBody Announcement announcement,
                                                     @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            announcementService.createAnnouncement(announcement);
        } catch (Exception e) {
            return getExceptionMessage("공고를 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }

        return ResponseEntity.ok(announcement);
    }

    @PostMapping("{announcementId}")
    public ResponseEntity<Object> createDetailsAnnouncement(@PathVariable UUID announcementId,
                                                            @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        var detailedAnnouncement = new DetailedAnnouncement();
        detailedAnnouncement.setTitle("");
        detailedAnnouncement.setDescription("");
        detailedAnnouncement.setPostingId(announcementId);

        try {
            detailedAnnouncementService.createDetailedAnnouncement(detailedAnnouncement);
        } catch (Exception e) {
            return getExceptionMessage("세부 공고를 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }

        return ResponseEntity.ok(detailedAnnouncement);
    }

    @GetMapping("/{announcementId}/{moduleId}/make")
    public ResponseEntity getMake(@PathVariable UUID moduleId) {
        return ResponseEntity.ok(moduleService.getAllModulesByCourse(moduleId));
    }


    @PutMapping("/{announcementId}/{detailedAnnouncementId}")
    public ResponseEntity<Object> updateModule(@RequestBody DetailedAnnouncement detailedAnnouncement) {
        try {
            return ResponseEntity.ok(detailedAnnouncementService.updateDetailedAnnouncement(detailedAnnouncement));
        } catch(Exception e) {
            return getExceptionMessage("세부 공고를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
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

    @PostMapping("{announcementId}/{moduleId}")
    public ResponseEntity createMake(@PathVariable UUID announcementId,
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

    public LudiumUser getLudiumUser(String accessToken) {
        try {
            var googleUserApiData = loginService.getUserResource(accessToken, "google");
            return ludiumUserService
                    .getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<Object> getUnAuthorizedMessage() {
        var unAuthorizedResponse = new HashMap<String, String>();

        unAuthorizedResponse.put("message", "인증에 실패했습니다.");

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(unAuthorizedResponse);
    }

    public ResponseEntity<Object> getExceptionMessage(String message, String debugMessage) {
        var exceptionResponse = new HashMap<String, String>();

        exceptionResponse.put("message", message);
        exceptionResponse.put("debug", debugMessage);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exceptionResponse);
    }
}
