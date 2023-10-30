package world.ludium.education.mission;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/mission", produces = "application/json")
public class MissionController {
    private LoginService loginService;
    private LudiumUserService ludiumUserService;
    private ArticleService articleService;
    private MissionSubmitService missionSubmitService;

    public MissionController(LoginService loginService,
                             LudiumUserService ludiumUserService,
                             ArticleService articleService,
                             MissionSubmitService missionSubmitService) {
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
        this.articleService = articleService;
        this.missionSubmitService = missionSubmitService;
    }

    @GetMapping("")
    public ResponseEntity getMissions() {
        return ResponseEntity.ok(articleService.getAllArticle());
    }

    @GetMapping("/{missionId}")
    public ResponseEntity getMission(@PathVariable UUID missionId) {
        return ResponseEntity.ok(articleService.getArticle(missionId));
    }

    @PostMapping("")
    public ResponseEntity createMission(@RequestParam String title,
                                        @RequestParam String content,
                                        @CookieValue(name = "access_token", required = false) String accessToken) {
        JsonNode googleUserApiData = loginService.getUserResource(accessToken, "google");

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article msission = new Article();
        msission.setTitle(title);
        msission.setContent(content);
        msission.setUsrId(ludiumUser.getId());

        try {
            articleService.createArticle(msission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "아티클을 만드는 중에 에러가 발생했습니다.");
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
        JsonNode googleUserApiData = loginService.getUserResource(accessToken, "google");

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

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

    @GetMapping("/submit/{missionId}")
    public ResponseEntity getMissionSubmits(@PathVariable UUID missionId) {
        List<MissionSubmit> missionSubmits = missionSubmitService.getMissionSubmits(missionId);

        return ResponseEntity.ok(missionSubmits);
    }

    @PutMapping("/submit/validate/{submitId}")
    public ResponseEntity validateSubmit(@PathVariable UUID submitId) {
        MissionSubmitHistory missionSubmitHistory = new MissionSubmitHistory();
        missionSubmitHistory.setMsnSbmId(submitId);
        missionSubmitHistory.setContent("검증됨");
        try {
            missionSubmitService.validateMissionSubmit(submitId);
            missionSubmitService.createMissionSubmitHistory(missionSubmitHistory);
        } catch(Exception e) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션을 검증하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(new HashMap<>() {{
            put("id", submitId);
            put("vldStt", true);
        }});
    }
}
