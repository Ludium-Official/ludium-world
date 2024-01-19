package world.ludium.education.community;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.community.model.Content;
import world.ludium.education.community.model.ContentComment;
import world.ludium.education.util.ResponseUtil;

import java.util.NoSuchElementException;
import java.util.UUID;

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

            if(contentList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("콘텐츠 데잍터가 없습니다.", "");

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

            if(contentCommeentList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("콘텐츠 댓글 데이터가 없습니다.", "");

            return ResponseEntity.ok(contentCommeentList);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("콘텐츠 댓글을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<Object> createContent(@RequestBody Content content,
                                                @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null) return responseUtil.getUnAuthorizedMessage();

        content.setUsrId(ludiumUser.getId());

        try {
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

        if (ludiumUser == null) return responseUtil.getUnAuthorizedMessage();

        comment.setContentId(contentId);
        comment.setUsrId(ludiumUser.getId());

        try {
            return ResponseEntity.ok(contentService.createContentComment(comment));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("콘텐츠 댓글을 추가하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
}
