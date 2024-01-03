package world.ludium.education.announcement;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.announcement.model.*;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.course.Module;
import world.ludium.education.course.ModuleService;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/announcement", produces = "application/json")
public class AnnouncementController {
    private final LoginService loginService;

    private final ArticleService articleService;
    private final LudiumUserService ludiumUserService;
    private final ModuleService moduleService;

    private final AnnouncementService announcementService;
    private final DetailedAnnouncementService detailedAnnouncementService;
    private final ApplicationTemplateService applicationTemplateService;
    private final ApplicationService applicationService;

    public AnnouncementController(LoginService loginService,
                                  ArticleService articleService,
                                  LudiumUserService ludiumUserService,
                                  ModuleService moduleService,
                                  AnnouncementService announcementService,
                                  DetailedAnnouncementService detailedAnnouncementService,
                                  ApplicationTemplateService applicationTemplateService,
                                  ApplicationService applicationService) {
        this.loginService = loginService;
        this.articleService = articleService;
        this.ludiumUserService = ludiumUserService;
        this.moduleService = moduleService;
        this.announcementService = announcementService;
        this.detailedAnnouncementService = detailedAnnouncementService;
        this.applicationTemplateService = applicationTemplateService;
        this.applicationService = applicationService;
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

    @GetMapping("/{announcementId}/{detailedAnnouncementId}/application-template")
    public ResponseEntity<Object> getApplicationTemplate(@PathVariable UUID detailedAnnouncementId,
                                                         @RequestParam String role) {
        try {
            return ResponseEntity.ok(applicationTemplateService.getApplicationTemplate(detailedAnnouncementId, role));
        } catch (NoSuchElementException nse) {
            return getNoSuchElementExceptionMessage("지원서 양식 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return getExceptionMessage("지원서 양식을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{announcementId}/{detailedAnnouncementId}/application")
    public ResponseEntity<Object> getApplication(@PathVariable UUID detailedAnnouncementId,
                                                 @RequestParam String role) {
        return ResponseEntity.ok(applicationService
                .getApplication(detailedAnnouncementId, role)
                .stream()
                .map((application) -> new ApplicationDTO(application, ludiumUserService.getUserById(application.getUsrId())))
                .collect(Collectors.toList()));
    }

    @GetMapping("/{announcementId}/{detailedAnnouncementId}/application/submit")
    public ResponseEntity<Object> getApplication(@PathVariable UUID detailedAnnouncementId,
                                                 @RequestParam String role,
                                                 @CookieValue(name = "access_token", required = false) String accessToken) {

        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity
                    .ok(applicationService.getApplication(detailedAnnouncementId, role, ludiumUser.getId()));
        } catch(NoSuchElementException nse) {
            return getNoSuchElementExceptionMessage("지원서 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return getExceptionMessage("지원서를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }

    }

    @GetMapping("{announcementId}/{detailedAnnouncementId}/worker")
    public ResponseEntity<Object> updateDetailsAnnouncementWorker(@PathVariable UUID detailedAnnouncementId,
                                                                  @RequestParam String role) {
        try {
            var detailedAnnouncementWorker = detailedAnnouncementService.getDetailedAnnouncementWorker(detailedAnnouncementId, role);
            var detailedAnnouncementWorkerDTO = new DetailedAnnouncementWorkerDTO(detailedAnnouncementWorker, ludiumUserService.getUserById(detailedAnnouncementWorker.getUsrId()));

            return ResponseEntity.ok(detailedAnnouncementWorkerDTO);
        } catch (NoSuchElementException nse) {
            return getNoSuchElementExceptionMessage("작업자 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return getExceptionMessage("작업자를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<Object> createAnnouncement(@RequestBody Announcement announcement,
                                                     @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(announcementService.createAnnouncement(announcement));
        } catch (Exception e) {
            return getExceptionMessage("공고를 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
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
            return ResponseEntity.ok(detailedAnnouncementService.createDetailedAnnouncement(detailedAnnouncement));
        } catch (Exception e) {
            return getExceptionMessage("세부 공고를 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("{announcementId}/{detailedAnnouncementId}/application-template")
    public ResponseEntity<Object> createApplicationTemplate(@RequestBody ApplicationTemplate applicationTemplate,
                                                            @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(applicationTemplateService.createApplicationTemplate(applicationTemplate));
        } catch (Exception e) {
            return getExceptionMessage("지원서 양식을 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("{announcementId}/{detailedAnnouncementId}/worker")
    public ResponseEntity<Object> createDetailsAnnouncementWorker(@RequestBody DetailedAnnouncementWorker detailedAnnouncementWorker,
                                                                  @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(detailedAnnouncementService.createDetailedAnnouncementWorker(detailedAnnouncementWorker));
        } catch (Exception e) {
            return getExceptionMessage("작업자를 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("{announcementId}/{detailedAnnouncementId}/application")
    public ResponseEntity<Object> createApplication(@RequestBody Application application,
                                                    @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        application.setUsrId(ludiumUser.getId());

        try {
            return ResponseEntity.ok(applicationService.createApplication(application));
        } catch (Exception e) {
            return getExceptionMessage("지원서를 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{announcementId}/{moduleId}/make")
    public ResponseEntity getMake(@PathVariable UUID moduleId) {
        return ResponseEntity.ok(moduleService.getAllModulesByCourse(moduleId));
    }

    @PutMapping("/{announcementId}")
    public ResponseEntity<Object> updateAnnouncement(@RequestBody Announcement announcement,
                                                     @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(announcementService.updateAnnouncement(announcement));
        } catch (Exception e) {
            return getExceptionMessage("공고를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }


    @PutMapping("/{announcementId}/{detailedAnnouncementId}")
    public ResponseEntity<Object> updateModule(@RequestBody DetailedAnnouncement detailedAnnouncement,
                                               @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(detailedAnnouncementService.updateDetailedAnnouncement(detailedAnnouncement));
        } catch (Exception e) {
            return getExceptionMessage("세부 공고를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("/{announcementId}/{detailedAnnouncementId}/application-template")
    public ResponseEntity<Object> getApplicationTemplate(@RequestBody ApplicationTemplate applicationTemplate,
                                                         @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(applicationTemplateService.updateApplicationTemplate(applicationTemplate));
        } catch (Exception e) {
            return getExceptionMessage("지원서 양식을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("{announcementId}/{detailedAnnouncementId}/worker")
    public ResponseEntity<Object> updateDetailsAnnouncementWorker(@RequestBody DetailedAnnouncementWorker detailedAnnouncementWorker,
                                                                  @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(detailedAnnouncementService.updateDetailedAnnouncementWorker(detailedAnnouncementWorker));
        } catch (Exception e) {
            return getExceptionMessage("작업자를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("/{announcementId}/{detailedAnnouncementId}/application")
    public ResponseEntity<Object> updateApplication(@RequestBody Application application,
                                                    @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = getLudiumUser(accessToken);

        if (ludiumUser == null)
            return getUnAuthorizedMessage();

        try {
            return ResponseEntity.ok(applicationService.updateApplication(application));
        } catch(Exception e) {
            return getExceptionMessage("지원서를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
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

    public ResponseEntity<Object> getNoSuchElementExceptionMessage(String message, String debugMessage) {
        var exceptionResponse = new HashMap<String, String>();

        exceptionResponse.put("message", message);
        exceptionResponse.put("debug", debugMessage);

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(exceptionResponse);
    }
}
