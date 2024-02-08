package world.ludium.education.profile;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.announcement.ApplicationService;
import world.ludium.education.announcement.DetailedAnnouncementService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.learning.LearningService;
import world.ludium.education.learning.MissionService;
import world.ludium.education.util.ResponseUtil;

import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping(value = "/profile", produces = "application/json")
public class ProfileController {
    private final LudiumUserService ludiumUserService;
    private final ResponseUtil responseUtil;
    private final ApplicationService applicationService;
    private final DetailedAnnouncementService detailedAnnouncementService;
    private final MissionService missionService;
    private final LearningService learningService;
    private static final Logger logger = Logger.getLogger(ProfileController.class.getName());

    public ProfileController(LudiumUserService ludiumUserService,
                             ResponseUtil responseUtil,
                             ApplicationService applicationService,
                             DetailedAnnouncementService detailedAnnouncementService,
                             MissionService missionService,
                             LearningService learningService) {
        this.ludiumUserService = ludiumUserService;
        this.responseUtil = responseUtil;
        this.applicationService = applicationService;
        this.detailedAnnouncementService = detailedAnnouncementService;
        this.missionService = missionService;
        this.learningService = learningService;
    }

    @GetMapping("")
    public ResponseEntity<Object> getProfile(@CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if(ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        return ResponseEntity.ok(ludiumUser);
    }

    @GetMapping("{userId}/application")
    public ResponseEntity<Object> getAllApplication(@PathVariable UUID userId) {
        try {
            var applicationList = applicationService.getAllApplication(userId);

            if(applicationList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("지원서 데이터가 없습니다.", "");

            return ResponseEntity.ok(applicationList);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("지원서를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{userId}/application/top4")
    public ResponseEntity<Object> getTop4Application(@PathVariable UUID userId) {
        try {
            var applicationList = applicationService.getTop4Application(userId);

            if(applicationList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("지원서 데이터가 없습니다.", "");

            return ResponseEntity.ok(applicationList);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("지원서를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{usrId}/detailed-announcement")
    public ResponseEntity<Object> getAllDetailedAnnouncement(@PathVariable UUID usrId) {
        try {
            var detailedAnnouncementList = detailedAnnouncementService.getAllDetailedAnnouncementByWorker(usrId);

            if(detailedAnnouncementList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("작업 데이터가 없습니다.", "");

            return ResponseEntity.ok(detailedAnnouncementList);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "작업을 조회하는 중에 에러가 발생했습니다", e);
            return responseUtil.getExceptionMessage("작업을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{usrId}/detailed-announcement/top4")
    public ResponseEntity<Object> getTop4DetailedAnnouncement(@PathVariable UUID usrId) {
        try {
            var detailedAnnouncementList = detailedAnnouncementService.getTop4DetailedAnnouncementByWorker(usrId);

            if(detailedAnnouncementList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("작업 데이터가 없습니다.", "");

            return ResponseEntity.ok(detailedAnnouncementList);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "작업을 조회하는 중에 에러가 발생했습니다", e);
            return responseUtil.getExceptionMessage("작업을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{usrId}/mission")
    public ResponseEntity<Object> getAllMission(@PathVariable UUID usrId) {
        try {
            var missionDTOList = missionService.getAllMyMissionDTO(usrId);

            if(missionDTOList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("미션 데이터가 없습니다.", "");

            return ResponseEntity.ok(missionDTOList);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "미션을 조회하는 중에 에러가 발생했습니다", e);
            return responseUtil.getExceptionMessage("미션을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{usrId}/mission/top4")
    public ResponseEntity<Object> getTop4Mission(@PathVariable UUID usrId) {
        try {
            var missionDTOList = missionService.getTop4MyMissionDTO(usrId);

            if(missionDTOList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("미션 데이터가 없습니다.", "");

            return ResponseEntity.ok(missionDTOList);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "미션을 조회하는 중에 에러가 발생했습니다", e);
            return responseUtil.getExceptionMessage("미션을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{usrId}/learning")
    public ResponseEntity<Object> getAllLearning(@PathVariable UUID usrId) {
        try {
            var learningList = learningService.getAllLearningDTO(usrId);

            if(learningList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("학습 데이터가 없습니다.", "");

            return ResponseEntity.ok(learningList);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "학습을 조회하는 중에 에러가 발생했습니다", e);
            return responseUtil.getExceptionMessage("학습을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{usrId}/learning/top4")
    public ResponseEntity<Object> getTop4Learning(@PathVariable UUID usrId) {
        try {
            var learningList = learningService.getTop4LearningDTO(usrId);

            if(learningList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("학습 데이터가 없습니다.", "");

            return ResponseEntity.ok(learningList);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "학습을 조회하는 중에 에러가 발생했습니다", e);
            return responseUtil.getExceptionMessage("학습을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("")
    public ResponseEntity<Object> updateProfile(@CookieValue(name = "access_token", required = false) String accessToken,
                                        @RequestBody LudiumUser user) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if(ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        user.setId(ludiumUser.getId());
        user.setGglId(ludiumUser.getGglId());

        try {
            return ResponseEntity.ok(ludiumUserService.updateUser(user));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("사용자를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{userId}")
    public ResponseEntity getUserProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(ludiumUserService.getUser(userId));
    }
}
