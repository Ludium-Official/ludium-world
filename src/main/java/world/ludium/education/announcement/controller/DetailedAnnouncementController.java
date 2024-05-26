package world.ludium.education.announcement.controller;

import java.nio.file.AccessDeniedException;
import java.sql.Timestamp;
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
import org.springframework.web.bind.annotation.RestController;
import world.ludium.education.announcement.model.DetailedAnnouncement;
import world.ludium.education.announcement.model.DetailedAnnouncementCoWorker;
import world.ludium.education.announcement.model.DetailedAnnouncementContent;
import world.ludium.education.announcement.model.DetailedAnnouncementContentComment;
import world.ludium.education.announcement.model.DetailedAnnouncementContentStatus;
import world.ludium.education.announcement.service.DetailedAnnouncementService;
import world.ludium.education.auth.model.LudiumUser;
import world.ludium.education.auth.service.LudiumUserService;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

@RestController
@RequestMapping(value = "/detailed-announcement", produces = "application/json")
public class DetailedAnnouncementController {

  private final DetailedAnnouncementService detailedAnnouncementService;
  private final ResponseUtil responseUtil;
  private final LudiumUserService ludiumUserService;

  public DetailedAnnouncementController(DetailedAnnouncementService detailedAnnouncementService,
      ResponseUtil responseUtil,
      LudiumUserService ludiumUserService) {
    this.detailedAnnouncementService = detailedAnnouncementService;
    this.responseUtil = responseUtil;
    this.ludiumUserService = ludiumUserService;
  }

  @GetMapping("")
  public ResponseEntity<Object> getDetailedAnnouncement() {
    try {
      var detailedAnnouncementList = detailedAnnouncementService.getAllDetailedAnnouncement();

      if (detailedAnnouncementList.isEmpty()) {
        throw new NoSuchFieldException();
      }

      return ResponseEntity.ok(detailedAnnouncementList);

    } catch (NoSuchFieldException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업 목록 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업 목록을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("{detailedAnnouncementId}")
  public ResponseEntity<Object> getDetailedAnnouncement(@PathVariable UUID detailedAnnouncementId) {
    try {
      return ResponseEntity.ok(
          detailedAnnouncementService.getDetailedAnnouncement(detailedAnnouncementId));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("{detailedAnnouncementId}/content")
  public ResponseEntity<Object> getAllDetailedAnnouncementContent(
      @PathVariable UUID detailedAnnouncementId) {
    try {
      var detailedAnnouncementContentList = detailedAnnouncementService
          .getAllDetailedAnnouncementContent(
              detailedAnnouncementId);

      if (detailedAnnouncementContentList.isEmpty()) {
        throw new NoSuchElementException();
      }

      return ResponseEntity.ok(detailedAnnouncementContentList);
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업물 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업물을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("{detailedAnnouncementId}/content/submit")
  public ResponseEntity<Object> getAllSubmittedDetailedAnnouncementContent(
      @PathVariable UUID detailedAnnouncementId) {
    try {
      var detailedAnnouncementContentList = detailedAnnouncementService
          .getAllDetailedAnnouncementContent(detailedAnnouncementId,
              DetailedAnnouncementContentStatus.SUBMIT.toString());

      if (detailedAnnouncementContentList.isEmpty()) {
        throw new NoSuchElementException();
      }

      return ResponseEntity.ok(detailedAnnouncementContentList);
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업물 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업물을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("{detailedAnnouncementId}/{detailedAnnouncementContentId}")
  public ResponseEntity<Object> getDetailedAnnouncementContent(
      @PathVariable UUID detailedAnnouncementContentId) {
    try {
      var detailedAnnouncementContent = detailedAnnouncementService
          .getDetailedAnnouncementContent(detailedAnnouncementContentId);

      return ResponseEntity.ok(detailedAnnouncementContent);
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업물 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업물을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("{detailedAnnouncementId}/{detailedAnnouncementContentId}/comment")
  public ResponseEntity<Object> getAllDetailedAnnouncementContentComment(
      @PathVariable UUID detailedAnnouncementContentId) {
    try {
      var detailedAnnouncementContentCommentList = detailedAnnouncementService
          .getAllDetailedAnnouncementContentComment(detailedAnnouncementContentId);

      if (detailedAnnouncementContentCommentList.isEmpty()) {
        throw new NoSuchElementException();
      }

      return ResponseEntity.ok(detailedAnnouncementContentCommentList);
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업물 댓글 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업물 댓글을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("{detailedAnnouncementId}/worker")
  public ResponseEntity<Object> getDetailedAnnouncementWorker(
      @PathVariable UUID detailedAnnouncementId) {
    try {
      return ResponseEntity.ok(
          detailedAnnouncementService.getDetailedAnnouncementWorker(detailedAnnouncementId,
              "PROVIDER"));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업자 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업자를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("{detailedAnnouncementId}/co-worker")
  public ResponseEntity<Object> getDetailedAnnouncementCoWorker(
      @PathVariable UUID detailedAnnouncementId) {
    try {
      var coWorkerList = detailedAnnouncementService.getAllDetailedAnnouncementCoWorker(
          detailedAnnouncementId);

      if (coWorkerList.isEmpty()) {
        return responseUtil.getNoSuchElementExceptionMessage("공동 작업자 데이터가 없습니다.", "");
      }

      return ResponseEntity.ok(coWorkerList);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공동 작업자를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{detailedAnnouncementId}")
  public ResponseEntity<Object> createDetailedAnnouncementContent(
      @PathVariable UUID detailedAnnouncementId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var detailedAnnouncementContent = new DetailedAnnouncementContent();

    detailedAnnouncementContent.setDetailId(detailedAnnouncementId);
    detailedAnnouncementContent.setUsrId(ludiumUser.getId());
    detailedAnnouncementContent.setTitle("");
    detailedAnnouncementContent.setDescription("");
    detailedAnnouncementContent.setCreateAt(new Timestamp(System.currentTimeMillis()));
    detailedAnnouncementContent.setStatus(DetailedAnnouncementContentStatus.CREATE.toString());

    try {
      checkDetailedAnnouncementWorker(detailedAnnouncementId, ludiumUser);
      return ResponseEntity.ok(detailedAnnouncementService.createDetailedAnnouncementContent(
          detailedAnnouncementContent));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업자 데이터가 없습니다.", nse.getMessage());
    } catch (AccessDeniedException ade) {
      return responseUtil.getForbiddenExceptionMessage(
          new ResponseException("작업자 정보가 일치하지 않습니다.", ade.getMessage()));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업물을 추가하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{detailedAnnouncementId}/{detailedAnnouncementContentId}")
  public ResponseEntity<Object> createDetailedAnnouncementContentComment(
      @PathVariable UUID detailedAnnouncementId,
      @PathVariable UUID detailedAnnouncementContentId,
      @RequestBody DetailedAnnouncementContentComment detailedAnnouncementContentComment,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    detailedAnnouncementContentComment.setDetailedContentId(detailedAnnouncementContentId);
    detailedAnnouncementContentComment.setUsrId(ludiumUser.getId());
    detailedAnnouncementContentComment.setCreateAt(new Timestamp(System.currentTimeMillis()));

    try {
      return ResponseEntity.ok(detailedAnnouncementService.createDetailedAnnouncementContentComment(
          detailedAnnouncementContentComment));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업물에 댓글을 추가하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("{detailedAnnouncementId}/co-worker")
  public ResponseEntity<Object> createCoWorker(
      @RequestBody DetailedAnnouncementCoWorker detailedAnnouncementCoWorker,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      detailedAnnouncementService.createDetailedAnnouncementCoWorker(detailedAnnouncementCoWorker);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공동 작업자를 추가하는 중에 에러가 발생했습니다.", e.getMessage());
    }

    return ResponseEntity.status(HttpStatus.CREATED).body(detailedAnnouncementCoWorker);
  }

  @PostMapping("{detailedAnnouncementId}/pin")
  public ResponseEntity<Object> pinDetailedAnnouncement(@PathVariable UUID detailedAnnouncementId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var maxPinDetailedAnnouncement = detailedAnnouncementService
        .getDetailedAnnouncementMaxPinOrder();
    var pinnedDetailedAnnouncement = detailedAnnouncementService.getDetailedAnnouncement(
        detailedAnnouncementId).orElseThrow();

    pinnedDetailedAnnouncement.setPinned(true);
    pinnedDetailedAnnouncement.setPinOrder(maxPinDetailedAnnouncement.getPinOrder() + 1);

    try {
      detailedAnnouncementService.updateDetailedAnnouncement(pinnedDetailedAnnouncement);

      return ResponseEntity.status(HttpStatus.CREATED).body(pinnedDetailedAnnouncement);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업을 상단 고정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PutMapping("{detailedAnnouncementId}")
  public ResponseEntity<Object> updateDetailedAnnouncement(
      @PathVariable UUID detailedAnnouncementId,
      @RequestBody DetailedAnnouncement detailedAnnouncement,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      detailedAnnouncementService.getDetailedAnnouncementWorker(detailedAnnouncementId, "PROVIDER");

      return ResponseEntity.ok(
          detailedAnnouncementService.updateDetailedAnnouncement(detailedAnnouncement));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업자 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PutMapping("{detailedAnnouncementId}/{detailedAnnouncementContentId}")
  public ResponseEntity<Object> updateDetailedAnnouncementContent(
      @PathVariable UUID detailedAnnouncementId,
      @RequestBody DetailedAnnouncementContent detailedAnnouncementContent,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    try {
      checkDetailedAnnouncementWorker(detailedAnnouncementId, ludiumUser);
      return ResponseEntity.ok(detailedAnnouncementService.updateDetailedAnnouncementContent(
          detailedAnnouncementContent));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("작업자 데이터가 없습니다.", nse.getMessage());
    } catch (AccessDeniedException ade) {
      return responseUtil.getForbiddenExceptionMessage(
          new ResponseException("작업자 정보가 일치하지 않습니다.", ade.getMessage()));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업물을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @DeleteMapping("{detailedAnnouncementId}/co-worker/{userId}")
  public ResponseEntity<Object> deleteAnnouncementCoWorker(
      @PathVariable UUID detailedAnnouncementId,
      @PathVariable UUID userId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var detailedAnnouncementCoWorker = new DetailedAnnouncementCoWorker();

    detailedAnnouncementCoWorker.setDetailId(detailedAnnouncementId);
    detailedAnnouncementCoWorker.setUsrId(userId);

    try {
      detailedAnnouncementService.deleteDetailedAnnouncementCoWorker(detailedAnnouncementCoWorker);

      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("공동 작업자를 삭제하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @DeleteMapping("{detailedAnnouncementId}/pin")
  public ResponseEntity<Object> unpinDetailedAnnouncement(@PathVariable UUID detailedAnnouncementId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var unpinnedDetailedAnnouncement = detailedAnnouncementService.getDetailedAnnouncement(
        detailedAnnouncementId).orElseThrow();

    unpinnedDetailedAnnouncement.setPinned(false);
    unpinnedDetailedAnnouncement.setPinOrder(-1);

    try {
      detailedAnnouncementService.updateDetailedAnnouncement(unpinnedDetailedAnnouncement);

      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("작업을 고정 해제하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  public void checkDetailedAnnouncementWorker(UUID detailedAnnouncementId, LudiumUser ludiumUser)
      throws AccessDeniedException {
    var detailedAnnouncementWorker = detailedAnnouncementService.getDetailedAnnouncementWorker(
        detailedAnnouncementId, "PROVIDER");
    var detailedAnnouncementCoWorkerList = detailedAnnouncementService
        .getAllDetailedAnnouncementCoWorker(detailedAnnouncementId);

    if (!detailedAnnouncementCoWorkerList.stream()
        .map(detailedAnnouncementCoWorker -> detailedAnnouncementCoWorker.usrId())
        .collect(Collectors.toList()).contains(ludiumUser.getId())) {
      if (!ludiumUser.getId().equals(detailedAnnouncementWorker.getUsrId())) {
        throw new AccessDeniedException("작업자 정보가 일치하지 않습니다.");
      }
    }
  }

}
