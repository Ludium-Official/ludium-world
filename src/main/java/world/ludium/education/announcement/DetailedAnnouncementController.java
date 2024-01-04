package world.ludium.education.announcement;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.announcement.model.DetailedAnnouncementContent;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

import java.util.NoSuchElementException;
import java.util.UUID;

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
        try{
            var detailedAnnouncementList = detailedAnnouncementService.getAllDetailedAnnouncement();

            if(detailedAnnouncementList.isEmpty()) throw new NoSuchFieldException();

            return ResponseEntity.ok(detailedAnnouncementList);

        } catch (NoSuchFieldException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("작업 목록 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("작업 목록을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{detailedAnnouncementId}")
    public ResponseEntity<Object> getDetailedAnnouncement(@PathVariable UUID detailedAnnouncementId){
        try {
            return ResponseEntity.ok(detailedAnnouncementService.getDetailedAnnouncement(detailedAnnouncementId));
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("작업 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("작업을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{detailedAnnouncementId}/content")
    public ResponseEntity<Object> getAllDetailedAnnouncementContent(@PathVariable UUID detailedAnnouncementId) {
        try {
            var detailedAnnouncementContentList = detailedAnnouncementService.getAllDetailedAnnouncementContent(detailedAnnouncementId);

            if(detailedAnnouncementContentList.isEmpty()) throw new NoSuchElementException();

            return ResponseEntity.ok(detailedAnnouncementContentList);
        } catch(NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("작업물 데이터가 없습니다.", nse.getMessage());
        } catch(Exception e) {
            return responseUtil.getExceptionMessage("작업물을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("{detailedAnnouncementId}")
    public  ResponseEntity<Object> createDetailedAnnouncementContent(@PathVariable UUID detailedAnnouncementId,
                                                                     @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        var detailedAnnouncementWorker = detailedAnnouncementService.getDetailedAnnouncementWorker(detailedAnnouncementId, "PROVIDER");

        if(!ludiumUser.getId().equals(detailedAnnouncementWorker.getUsrId()))
            return responseUtil.getForbiddenExceptionMessage(new ResponseException("작업자 정보와 작업물 생성자의 계정이 다릅니다.", ""));

        var detailedAnnouncementContent = new DetailedAnnouncementContent();

        detailedAnnouncementContent.setDetailId(detailedAnnouncementId);
        detailedAnnouncementContent.setUsrId(ludiumUser.getId());
        detailedAnnouncementContent.setTitle("");
        detailedAnnouncementContent.setDescription("");

        try {
            return ResponseEntity.ok(detailedAnnouncementService.createDetailedAnnouncementContent(detailedAnnouncementContent));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("작업물을 추가하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
}
