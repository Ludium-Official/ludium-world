package world.ludium.education.profile;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import world.ludium.education.article.Article;
import world.ludium.education.article.ArticleService;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.mission.MissionSubmit;
import world.ludium.education.mission.MissionSubmitComment;
import world.ludium.education.mission.MissionSubmitService;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
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
        JsonNode googleUserApiData = loginService.getUserResource(accessToken, "google");

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
        List<Article> articles = articleService.getAllArticlesByUsrId(ludiumUser.getId());

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
            put("submits", submits);
            put("comments", comments);
            put("userCommentsByMyMission", userCommentsByMyMission);
            }}
        );
    }
}
