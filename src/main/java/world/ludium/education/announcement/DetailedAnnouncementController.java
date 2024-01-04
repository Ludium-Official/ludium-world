package world.ludium.education.announcement;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import world.ludium.education.util.ResponseUtil;

import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping(value = "/detailed-announcement", produces = "application/json")
public class DetailedAnnouncementController {
    private final DetailedAnnouncementService detailedAnnouncementService;
    private final ResponseUtil responseUtil;

    public DetailedAnnouncementController(DetailedAnnouncementService detailedAnnouncementService,
                                          ResponseUtil responseUtil) {
        this.detailedAnnouncementService = detailedAnnouncementService;
        this.responseUtil = responseUtil;
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
}
