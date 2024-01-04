package world.ludium.education.profile;

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
import world.ludium.education.mission.MissionSubmit;
import world.ludium.education.mission.MissionSubmitComment;
import world.ludium.education.mission.MissionSubmitService;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/profile", produces = "application/json")
public class ProfileController {
    LoginService loginService;
    LudiumUserService ludiumUserService;
    ArticleService articleService;
    MissionSubmitService missionSubmitService;

    public ProfileController(LoginService loginService, LudiumUserService ludiumUserService, ArticleService articleService, MissionSubmitService missionSubmitService) {
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
        this.articleService = articleService;
        this.missionSubmitService = missionSubmitService;
    }

    @GetMapping("")
    public ResponseEntity getProfile(@CookieValue(name = "access_token", required = false) String accessToken) {
        JsonNode googleUserApiData = null;
        try {
            googleUserApiData = loginService.getUserResource(accessToken, "google");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new HashMap<String, String>() {{
                        put("message", "인증에 실패했습니다.");
                        put("debug", e.getMessage());
                    }
                    });
        }

        LudiumUser ludiumUser = ludiumUserService.getUser(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
        List<Article> myAllArticles = articleService.getAllArticlesByUsrId(ludiumUser.getId());

        List<Article> articles = myAllArticles.stream()
                .filter(article -> article.getCategory() == Category.ARTICLE)
                .toList();

        List<Article> missions = myAllArticles.stream()
                .filter(article -> article.getCategory() == Category.MISSION)
                .toList();

        List<Article> freeBoards = myAllArticles.stream()
                .filter(article -> article.getCategory() == Category.FREE_BOARD)
                .toList();

        List<MissionSubmitComment> userCommentsByMyMission = articles.stream()
                .flatMap(article -> {
                    List<MissionSubmit> submits = missionSubmitService.getMissionSubmits(article.getId());

                    return submits.stream()
                            .map(submit -> missionSubmitService.getMissionSubmitComments(submit.getId()))
                            .flatMap(List::stream);
                })
                .collect(Collectors.toList());

        List<MissionSubmit> submits = missionSubmitService.getAllMissionSubmitByUsrId(ludiumUser.getId());
        List<MissionSubmitComment> comments = missionSubmitService.getAllMissionSubmitCommentByUsrId(ludiumUser.getId());

        return ResponseEntity.ok(new HashMap<>(){{
            put("user", ludiumUser);
            put("articles", articles);
            put("missions", missions);
            put("freeBoards", freeBoards);
            put("submits", submits);
            put("comments", comments);
            put("userCommentsByMyMission", userCommentsByMyMission);
            }}
        );
    }

    @PutMapping("")
    public ResponseEntity updateProfile(@CookieValue(name = "access_token", required = false) String accessToken,
                                        @RequestParam String nick,
                                        @RequestParam String phone_number,
                                        @RequestParam String self_intro) {
        JsonNode googleUserApiData = null;
        try {
            googleUserApiData = loginService.getUserResource(accessToken, "google");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new HashMap<String, String>() {{
                        put("message", "인증에 실패했습니다.");
                        put("debug", e.getMessage());
                    }
                    });
        }

        LudiumUser ludiumUser = ludiumUserService.getUser(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
        ludiumUser.setNick(nick);
        ludiumUser.setSelfIntro(self_intro);
        ludiumUser.setPhnNmb(phone_number);

        try {
            ludiumUserService.updateUser(ludiumUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "사용자 데이터를 변경하는 중에 에러가 발생했습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("nick", nick);
            put("self_intro", self_intro);
            put("phn_nmb", phone_number);
        }});
    }

    @GetMapping("{userId}")
    public ResponseEntity getUserProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(ludiumUserService.getUser(userId));
    }
}
