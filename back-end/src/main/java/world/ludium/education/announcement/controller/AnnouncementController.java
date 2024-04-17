package world.ludium.education.announcement.controller;

import java.sql.Timestamp;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import world.ludium.education.announcement.dto.ApplicationDTO;
import world.ludium.education.announcement.dto.DetailedAnnouncementWorkerDTO;
import world.ludium.education.announcement.model.Announcement;
import world.ludium.education.announcement.model.Application;
import world.ludium.education.announcement.model.ApplicationTemplate;
import world.ludium.education.announcement.model.DetailedAnnouncement;
import world.ludium.education.announcement.model.DetailedAnnouncementStatus;
import world.ludium.education.announcement.model.DetailedAnnouncementWorker;
import world.ludium.education.announcement.service.AnnouncementService;
import world.ludium.education.announcement.service.ApplicationService;
import world.ludium.education.announcement.service.ApplicationTemplateService;
import world.ludium.education.announcement.service.DetailedAnnouncementService;
import world.ludium.education.auth.service.LudiumUserService;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

@RestController
@RequestMapping(value = "/announcement", produces = "application/json")
public class AnnouncementController {

  private final LudiumUserService ludiumUserService;
  // 위의 4개 서비스는 최적화 될 예정임
  private final AnnouncementService announcementService;
  private final DetailedAnnouncementService detailedAnnouncementService;
  private final ApplicationTemplateService applicationTemplateService;
  private final ApplicationService applicationService;
  private final ResponseUtil responseUtil;

  public AnnouncementController(LudiumUserService ludiumUserService,
      AnnouncementService announcementService,
      DetailedAnnouncementService detailedAnnouncementService,
      ApplicationTemplateService applicationTemplateService,
      ApplicationService applicationService,
      ResponseUtil responseUtil) {
    this.ludiumUserService = ludiumUserService;
    this.announcementService = announcementService;
    this.detailedAnnouncementService = detailedAnnouncementService;
    this.applicationTemplateService = applicationTemplateService;
    this.applicationService = applicationService;
    this.responseUtil = responseUtil;
  }

  @GetMapping("")
  public ResponseEntity<List<Announcement>> getAllAnnouncement() {
    return ResponseEntity.ok(announcementService.getAllAnnouncement());
  }

  @GetMapping("/top5")
  public ResponseEntity<Object> getTop5Announcement() {
    try {
      var top5AnnouncementList = announcementService.getTop5Announcement();

      if (top5AnnouncementList.isEmpty()) {
        return responseUtil.getNoSuchElementExceptionMessage("공고 데이터가 없습니다.", "");
      }

      return ResponseEntity.ok(top5AnnouncementList);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공고 목록을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/{announcementId}")
  public ResponseEntity<Announcement> getAnnouncement(@PathVariable UUID announcementId) {
    return ResponseEntity.ok(announcementService.getAnnouncement(announcementId).orElseThrow());
  }

  @GetMapping("/{announcementId}/detail")
  public ResponseEntity<List<DetailedAnnouncement>> getAllDetailedAnnouncementByAnnouncement(
      @PathVariable UUID announcementId) {
    return ResponseEntity.ok(
        detailedAnnouncementService.getAllDetailedAnnouncement(announcementId));
  }

  @GetMapping("/{announcementId}/{detailedAnnouncementId}")
  public ResponseEntity<DetailedAnnouncement> getDetailedAnnouncement(
      @PathVariable UUID detailedAnnouncementId) {
    return ResponseEntity.ok(
        detailedAnnouncementService.getDetailedAnnouncement(detailedAnnouncementId).orElseThrow());
  }

  @GetMapping("/{announcementId}/{detailedAnnouncementId}/application-template")
  public ResponseEntity<Object> getApplicationTemplate(@PathVariable UUID detailedAnnouncementId,
      @RequestParam String role) {
    try {
      return ResponseEntity.ok(
          applicationTemplateService.getApplicationTemplate(detailedAnnouncementId, role));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("지원서 양식 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("지원서 양식을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/{announcementId}/{detailedAnnouncementId}/application")
  public ResponseEntity<Object> getApplication(@PathVariable UUID detailedAnnouncementId,
      @RequestParam String role) {
    return ResponseEntity.ok(applicationService
        .getApplication(detailedAnnouncementId, role)
        .stream()
        .map((application) -> new ApplicationDTO(application,
            ludiumUserService.getUser(application.getUsrId())))
        .collect(Collectors.toList()));
  }

  @GetMapping("/{announcementId}/{detailedAnnouncementId}/application/submit")
  public ResponseEntity<Object> getApplication(@PathVariable UUID detailedAnnouncementId,
      @RequestParam String role,
      @CookieValue(name = "access_token", required = false) String accessToken) {

    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      return ResponseEntity
          .ok(applicationService.getApplication(detailedAnnouncementId, role, ludiumUser.getId()));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("지원서 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("지원서를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }

  }

  @GetMapping("{announcementId}/{detailedAnnouncementId}/worker")
  public ResponseEntity<Object> getAnnouncementWorker(@PathVariable UUID detailedAnnouncementId,
      @RequestParam String role) {
    try {
      var detailedAnnouncementWorker = detailedAnnouncementService.getDetailedAnnouncementWorker(
          detailedAnnouncementId, role);
      var detailedAnnouncementWorkerDto = new DetailedAnnouncementWorkerDTO(
          detailedAnnouncementWorker,
          ludiumUserService.getUser(detailedAnnouncementWorker.getUsrId()));

      return ResponseEntity.ok(detailedAnnouncementWorkerDto);
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업자 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업자를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("")
  public ResponseEntity<Object> createAnnouncement(@RequestBody Announcement announcement,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      return ResponseEntity.ok(announcementService.createAnnouncement(announcement));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공고를 만드는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{announcementId}")
  public ResponseEntity<Object> createDetailedAnnouncement(@PathVariable UUID announcementId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var detailedAnnouncement = new DetailedAnnouncement();
    detailedAnnouncement.setTitle("");
    detailedAnnouncement.setDescription("");
    detailedAnnouncement.setPostingId(announcementId);
    detailedAnnouncement.setStatus(DetailedAnnouncementStatus.CREATE.toString());
    detailedAnnouncement.setCreateAt(new Timestamp(System.currentTimeMillis()));
    detailedAnnouncement.setPinned(false);
    detailedAnnouncement.setPinOrder(-1);

    try {
      return ResponseEntity.ok(
          detailedAnnouncementService.createDetailedAnnouncement(detailedAnnouncement));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("세부 공고를 만드는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{announcementId}/{detailedAnnouncementId}/application-template")
  public ResponseEntity<Object> createApplicationTemplate(
      @RequestBody ApplicationTemplate applicationTemplate,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }
 
    try {
      return ResponseEntity.ok(
          applicationTemplateService.createApplicationTemplate(applicationTemplate));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("지원서 양식을 만드는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{announcementId}/{detailedAnnouncementId}/worker")
  public ResponseEntity<Object> createDetailedAnnouncementWorker(
      @RequestBody DetailedAnnouncementWorker detailedAnnouncementWorker,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      var detailedAnnouncement = detailedAnnouncementService.getDetailedAnnouncement(
          detailedAnnouncementWorker.getDetailId()).orElseThrow();

      detailedAnnouncement.setStatus(DetailedAnnouncementStatus.CLOSED.toString());

      detailedAnnouncementService.updateDetailedAnnouncement(detailedAnnouncement);

      return ResponseEntity.ok(
          detailedAnnouncementService.createDetailedAnnouncementWorker(detailedAnnouncementWorker));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업자를 만드는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{announcementId}/{detailedAnnouncementId}/application")
  public ResponseEntity<Object> createApplication(@RequestBody Application application,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    application.setUsrId(ludiumUser.getId());

    try {
      return ResponseEntity.ok(applicationService.createApplication(application));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("지원서를 만드는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{announcementId}/pin")
  public ResponseEntity<Object> pinAnnouncement(@PathVariable UUID announcementId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var maxPinAnnouncement = announcementService.getAnnouncementMaxPinOrder();
    var pinnedAnnouncement = announcementService.getAnnouncement(announcementId).orElseThrow();

    if (pinnedAnnouncement.isPinned()) {
      return responseUtil.getDuplicateExceptionMessage(
          new ResponseException("이미 상단 고정된 공고가 있습니다.", ""));
    }

    pinnedAnnouncement.setPinned(true);
    pinnedAnnouncement.setPinOrder(maxPinAnnouncement.getPinOrder() + 1);

    try {
      announcementService.updateAnnouncement(pinnedAnnouncement);

      return ResponseEntity.status(HttpStatus.CREATED).body(pinnedAnnouncement);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공고를 상단 고정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PutMapping("/{announcementId}")
  public ResponseEntity<Object> updateAnnouncement(@RequestBody Announcement announcement,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      return ResponseEntity.ok(announcementService.updateAnnouncement(announcement));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공고를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }


  @PutMapping("/{announcementId}/{detailedAnnouncementId}")
  public ResponseEntity<Object> updateDetailedAnnouncement(
      @RequestBody DetailedAnnouncement detailedAnnouncement,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      return ResponseEntity.ok(
          detailedAnnouncementService.updateDetailedAnnouncement(detailedAnnouncement));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("세부 공고를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PutMapping("/{announcementId}/{detailedAnnouncementId}/application-template")
  public ResponseEntity<Object> updateApplicationTemplate(
      @RequestBody ApplicationTemplate applicationTemplate,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      return ResponseEntity.ok(
          applicationTemplateService.updateApplicationTemplate(applicationTemplate));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("지원서 양식을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PutMapping("{announcementId}/{detailedAnnouncementId}/worker")
  public ResponseEntity<Object> updateDetailedAnnouncementWorker(
      @RequestBody DetailedAnnouncementWorker detailedAnnouncementWorker,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      return ResponseEntity.ok(
          detailedAnnouncementService.updateDetailedAnnouncementWorker(detailedAnnouncementWorker));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업자를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PutMapping("/{announcementId}/{detailedAnnouncementId}/application")
  public ResponseEntity<Object> updateApplication(@RequestBody Application application,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      return ResponseEntity.ok(applicationService.updateApplication(application));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("지원서를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @DeleteMapping("{announcementId}/{detailedAnnouncementId}/worker/{userId}/{role}")
  public ResponseEntity<Object> deleteAnnouncementWorker(@PathVariable UUID detailedAnnouncementId,
      @PathVariable UUID userId,
      @PathVariable String role,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var detailedAnnouncementWorker = new DetailedAnnouncementWorker();

    detailedAnnouncementWorker.setDetailId(detailedAnnouncementId);
    detailedAnnouncementWorker.setUsrId(userId);
    detailedAnnouncementWorker.setRole(role);

    try {
      var detailedAnnouncement = detailedAnnouncementService.getDetailedAnnouncement(
          detailedAnnouncementWorker.getDetailId()).orElseThrow();

      detailedAnnouncement.setStatus(DetailedAnnouncementStatus.CREATE.toString());

      detailedAnnouncementService.updateDetailedAnnouncement(detailedAnnouncement);

      detailedAnnouncementService.deleteDetailedAnnouncementWorker(detailedAnnouncementWorker);

      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업자 할당을 해제하는 중에 에러가 발생했습니다", e.getMessage());
    }

  }

  @DeleteMapping("{announcementId}/pin")
  public ResponseEntity<Object> unpinAnnouncement(@PathVariable UUID announcementId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var unpinnedAnnouncement = announcementService.getAnnouncement(announcementId).orElseThrow();

    if (!unpinnedAnnouncement.isPinned()) {
      return responseUtil.getDuplicateExceptionMessage(
          new ResponseException("고정된 공고가 아닙니다.", ""));
    }

    unpinnedAnnouncement.setPinned(false);
    unpinnedAnnouncement.setPinOrder(-1);

    try {
      announcementService.updateAnnouncement(unpinnedAnnouncement);

      return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공고를 고정 해제하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }
}
