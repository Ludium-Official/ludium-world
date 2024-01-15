package world.ludium.education.mission;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;
import world.ludium.education.article.Category;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.learning.MissionService;
import world.ludium.education.learning.model.EnhancedMissionSubmit;
import world.ludium.education.learning.model.EnhancedMissionSubmitStatus;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/mission", produces = "application/json")
public class MissionController {
    private final LoginService loginService;
    private final LudiumUserService ludiumUserService;
    private final ArticleService articleService;
    private final MissionSubmitService missionSubmitService;
    private final MissionService missionService;
    private final ResponseUtil responseUtil;

    public MissionController(LoginService loginService,
                             LudiumUserService ludiumUserService,
                             ArticleService articleService,
                             MissionSubmitService missionSubmitService,
                             MissionService missionService,
                             ResponseUtil responseUtil) {
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
        this.articleService = articleService;
        this.missionSubmitService = missionSubmitService;
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
    @PostMapping("")
    public ResponseEntity createMission(@RequestParam String title,
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

        LudiumUser ludiumUser = ludiumUserService.getUser(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article mission = new Article();
        mission.setTitle(title);
        mission.setContent(content);
        mission.setUsrId(ludiumUser.getId());
        mission.setCategory(Category.MISSION);

        try {
            articleService.createArticle(mission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "미션을 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {
            {
                put("title", title);
                put("content", content);
            }
        });
    }

    @PostMapping("/{missionId}")
    public ResponseEntity submitMission(@PathVariable UUID missionId,
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

        LudiumUser ludiumUser = ludiumUserService.getUser(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        MissionSubmit missionSubmit = new MissionSubmit();

        missionSubmit.setContent(content);
        missionSubmit.setMsnId(missionId);
        missionSubmit.setUsrId(ludiumUser.getId());

        MissionSubmitHistory missionSubmitHistory = new MissionSubmitHistory();

        missionSubmitHistory.setContent(content);

        try {
            missionSubmitService.createMissionSubmit(missionSubmit);
            missionSubmitHistory.setMsnSbmId(missionSubmit.getId());
            missionSubmitService.createMissionSubmitHistory(missionSubmitHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("message", "미션을 제출하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity
                .ok(new HashMap<String, String>() {{
                    put("missionId", missionId.toString());
                    put("content", content);
                }});
    }
}
