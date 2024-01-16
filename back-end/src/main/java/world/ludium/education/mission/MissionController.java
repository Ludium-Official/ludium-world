package world.ludium.education.mission;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.article.ArticleService;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.learning.MissionService;
import world.ludium.education.learning.model.EnhancedMissionSubmitStatus;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping(value = "/mission", produces = "application/json")
public class MissionController {
    private final LudiumUserService ludiumUserService;
    private final MissionService missionService;
    private final ResponseUtil responseUtil;

    public MissionController(LudiumUserService ludiumUserService,
                             MissionService missionService,
                             ResponseUtil responseUtil) {
        this.ludiumUserService = ludiumUserService;
        this.missionService = missionService;
        this.responseUtil = responseUtil;
    }

    @GetMapping("")
    public ResponseEntity<Object> getMissions() {
        try {
            var missionList = missionService.getAllMission();

            if (missionList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("미션 데이터가 없습니다.", "");

            return ResponseEntity.ok(missionList);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{missionId}")
    public ResponseEntity<Object> getMission(@PathVariable UUID missionId) {
        try {
            return ResponseEntity.ok(missionService.getMission(missionId));
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("미션 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{missionId}/submit")
    public ResponseEntity<Object> getAllMissionSubmit(@PathVariable UUID missionId) {
        try {
            var missionSubmitList = missionService.getAllMissionSubmit(missionId);

            if (missionSubmitList.isEmpty())
                return responseUtil.getNoSuchElementExceptionMessage("미션 제출 데이터가 없습니다.", "");

            return ResponseEntity.ok(missionSubmitList);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션 제출목록을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{missionId}/submit/{usrId}/comment")
    public ResponseEntity<Object> getMissionSubmitCommentList(@PathVariable UUID missionId,
                                                              @PathVariable UUID usrId) {
        try {
            var missionSubmitCommentList = missionService.getAllMissionSubmitComment(missionId, usrId);

            if(missionSubmitCommentList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("미션 제출 댓글 데이터가 없습니다.", "");

            return ResponseEntity.ok(missionSubmitCommentList);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션 제출 댓글을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("/{missionId}/submit/{usrId}/comment")
    public ResponseEntity<Object> createMissionSubmitComment(@PathVariable UUID missionId,
                                                             @PathVariable UUID usrId,
                                                             @RequestBody EnhancedMissionSubmitComment missionSubmitComment,
                                                             @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        missionSubmitComment.setMissionId(missionId);
        missionSubmitComment.setUsrId(usrId);
        missionSubmitComment.setCommentor(ludiumUser.getId());

        try {
            return ResponseEntity.ok(missionService.createMissionSubmitComment(missionSubmitComment));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션 제출 댓글을 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("/{missionId}/submit/{usrId}")
    public ResponseEntity<Object> updateMissionSubmit(@PathVariable UUID missionId,
                                                      @PathVariable UUID usrId) {
        try {
            var missionSubmit = missionService.getMissionSubmit(missionId, usrId);

            if(missionSubmit.getStatus().equals(EnhancedMissionSubmitStatus.APPROVE.toString()))
                return responseUtil.getDuplicateExceptionMessage(new ResponseException("이미 승인된 미션입니다.", ""));

            missionSubmit.setStatus(EnhancedMissionSubmitStatus.APPROVE.toString());

            return ResponseEntity.ok(missionService.updateMissionSubmit(missionSubmit));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션 제출을 승인하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
}
