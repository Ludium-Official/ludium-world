package world.ludium.education.community;

import java.util.NoSuchElementException;
import java.util.UUID;
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
import world.ludium.education.auth.service.LudiumUserService;
import world.ludium.education.community.model.Content;
import world.ludium.education.community.model.ContentComment;
import world.ludium.education.community.model.ContentRecommend;
import world.ludium.education.community.model.ContentRecommendId;
import world.ludium.education.community.model.ContentType;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

@RestController
@RequestMapping(value = "/content", produces = "application/json")
public class ContentController {

  private final LudiumUserService ludiumUserService;
  private final ResponseUtil responseUtil;
  private final ContentService contentService;

  public ContentController(LudiumUserService ludiumUserService,
      ResponseUtil responseUtil,
      ContentService contentService) {
    this.ludiumUserService = ludiumUserService;
    this.responseUtil = responseUtil;
    this.contentService = contentService;
  }

  @GetMapping("")
  public ResponseEntity<Object> getAllContent() {
    try {
      var contentList = contentService.getAllContent();

      if (contentList.isEmpty()) {
        return responseUtil.getNoSuchElementExceptionMessage("콘텐츠 데이터가 없습니다.", "");
      }

      return ResponseEntity.ok(contentList);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/{contentId}")
  public ResponseEntity<Object> getContent(@PathVariable UUID contentId) {
    try {
      return ResponseEntity.ok(contentService.getContent(contentId));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("콘텐츠 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/{contentId}/comment")
  public ResponseEntity<Object> getAllContentComment(@PathVariable UUID contentId) {
    try {
      var contentCommeentList = contentService.getAllContentComment(contentId);

      if (contentCommeentList.isEmpty()) {
        return responseUtil.getNoSuchElementExceptionMessage("콘텐츠 댓글 데이터가 없습니다.", "");
      }

      return ResponseEntity.ok(contentCommeentList);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠 댓글을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/latest-announcement")
  public ResponseEntity<Object> getLatestAnnouncement() {
    try {
      return ResponseEntity.ok(contentService.getLatestAnnouncement());
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("최신 공지 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("최신 공지를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/latest-banner")
  public ResponseEntity<Object> getLatestBanner() {
    try {
      return ResponseEntity.ok(contentService.getLatestBanner());
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("최신 배너 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("최신 배너를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/{contentId}/recommend")
  public ResponseEntity<Object> getContentRecommend(@PathVariable UUID contentId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var contentRecommendId = new ContentRecommendId();

    contentRecommendId.setContentId(contentId);
    contentRecommendId.setUsrId(ludiumUser.getId());

    try {
      return ResponseEntity.ok(contentService.getContentRecommend(contentRecommendId));
    } catch (NoSuchElementException nse) {
      return responseUtil.getNoSuchElementExceptionMessage("추천 데이터가 없습니다.", nse.getMessage());
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("추천을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @GetMapping("/{contentId}/recommend/count")
  public ResponseEntity<Object> getContentRecommendCount(@PathVariable UUID contentId) {
    try {
      return ResponseEntity.ok(contentService.getContentRecommendCount(contentId));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠의 추천 수를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("")
  public ResponseEntity<Object> createContent(@RequestBody Content content,
      @RequestParam(required = false) String type,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    content.setUsrId(ludiumUser.getId());

    try {
      var contentType =
          type == null ? ContentType.CONTENT.toString() : ContentType.valueOf(type).toString();
      content.setType(contentType);

      if (contentType.equals(ContentType.ANNOUNCEMENT.toString()) || contentType.equals(
          ContentType.BANNER.toString())) {
        if (!ludiumUserService.isAdmin(ludiumUser.getId())) {
          return responseUtil.getForbiddenExceptionMessage(
              new ResponseException("관리자만 공지사항 혹은 배너를 추가할 수 있습니다.", ""));
        }
      }

      return ResponseEntity.ok(contentService.createContent(content));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 저장하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("/{contentId}/comment")
  public ResponseEntity<Object> createContentComment(@PathVariable UUID contentId,
      @RequestBody ContentComment comment,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    comment.setContentId(contentId);
    comment.setUsrId(ludiumUser.getId());

    try {
      return ResponseEntity.ok(contentService.createContentComment(comment));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠 댓글을 추가하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PutMapping("/{contentId}")
  public ResponseEntity<Object> updateContent(@PathVariable UUID contentId,
      @RequestBody Content content,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    if (!ludiumUser.getId().equals(content.getUsrId())) {
      return responseUtil.getForbiddenExceptionMessage(
          new ResponseException("콘텐츠 글쓴이 정보가 일치하지 않습니다.", ""));
    }

    if (content.getType().equals(ContentType.ANNOUNCEMENT.toString()) || content.getType()
        .equals(ContentType.BANNER.toString())) {
      if (!ludiumUserService.isAdmin(ludiumUser.getId())) {
        return responseUtil.getForbiddenExceptionMessage(
            new ResponseException("관리자만 공지사항 혹은 배너를 수정할 수 있습니다.", ""));
      }
    }

    try {
      return ResponseEntity.ok(contentService.updateContent(content));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("/{contentId}/pin")
  public ResponseEntity<Object> pinContent(@PathVariable UUID contentId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var maxPinnedContent = contentService.getContentMaxPinOrder();
    var updatedContent = contentService.getContent(contentId);

    if (updatedContent.isPinned()) {
      return responseUtil.getDuplicateExceptionMessage(
          new ResponseException("이미 상단 고정된 콘텐츠입니다.", ""));
    }

    updatedContent.setPinned(true);
    updatedContent.setPinOrder(maxPinnedContent.getPinOrder() + 1);

    try {
      contentService.updateContent(updatedContent);

      return ResponseEntity.status(HttpStatus.CREATED).body(updatedContent);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 상단 고정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @PostMapping("/{contentId}/recommend")
  public ResponseEntity<Object> recommendContent(@PathVariable UUID contentId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var contentRecommendId = new ContentRecommendId();
    contentRecommendId.setContentId(contentId);
    contentRecommendId.setUsrId(ludiumUser.getId());

    if (contentService.isContentRecommendExist(contentRecommendId)) {
      return responseUtil.getDuplicateExceptionMessage(
          new ResponseException("이미 추천한 콘텐츠입니다.", ""));
    }

    var contentRecommend = new ContentRecommend();

    contentRecommend.setContentId(contentId);
    contentRecommend.setUsrId(ludiumUser.getId());

    try {
      var createdContentRecommend = contentService.createContentRecommend(contentRecommend);

      return ResponseEntity.status(HttpStatus.CREATED).body(createdContentRecommend);
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 추천하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @DeleteMapping("/{contentId}")
  public ResponseEntity<Object> deleteContent(@PathVariable UUID contentId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var content = contentService.getContent(contentId);

    if (!ludiumUser.getId().equals(content.getUsrId())) {
      return responseUtil.getForbiddenExceptionMessage(
          new ResponseException("콘텐츠 글쓴이 정보가 일치하지 않습니다.", ""));
    }

    if (content.getType().equals(ContentType.ANNOUNCEMENT.toString()) || content.getType()
        .equals(ContentType.BANNER.toString())) {
      if (!ludiumUserService.isAdmin(ludiumUser.getId())) {
        return responseUtil.getForbiddenExceptionMessage(
            new ResponseException("관리자만 공지사항 혹은 배너를 삭제할 수 있습니다.", ""));
      }
    }

    try {
      return ResponseEntity.ok(contentService.deleteContent(content));
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @DeleteMapping("/{contentId}/pin")
  public ResponseEntity<Object> unpinContent(@PathVariable UUID contentId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var updatedContent = contentService.getContent(contentId);

    if (!updatedContent.isPinned()) {
      return responseUtil.getDuplicateExceptionMessage(
          new ResponseException("이미 고정 해제된 콘텐츠입니다.", ""));
    }

    updatedContent.setPinned(false);
    updatedContent.setPinOrder(-1);

    try {
      contentService.updateContent(updatedContent);

      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 고정 해제하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }

  @DeleteMapping("/{contentId}/recommend")
  public ResponseEntity<Object> cancelRecommendContent(@PathVariable UUID contentId,
      @CookieValue(name = "access_token", required = false) String accessToken) {
    var ludiumUser = ludiumUserService.getUser(accessToken);

    if (ludiumUser == null) {
      return responseUtil.getUnAuthorizedMessage();
    }

    var contentRecommendId = new ContentRecommendId();
    contentRecommendId.setContentId(contentId);
    contentRecommendId.setUsrId(ludiumUser.getId());

    if (!contentService.isContentRecommendExist(contentRecommendId)) {
      return responseUtil.getDuplicateExceptionMessage(
          new ResponseException("추천하지 않은 콘텐츠입니다.", ""));
    }

    try {
      contentService.deleteContentRecommend(contentRecommendId);

      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return responseUtil.getExceptionMessage("콘텐츠를 추천 해제하는 중에 에러가 발생했습니다.", e.getMessage());
    }
  }
}
