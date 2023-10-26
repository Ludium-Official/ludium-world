package world.ludium.education.article;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;

import java.math.BigInteger;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/article", produces = "application/json")
public class ArticleController {

    private LoginService loginService;
    private LudiumUserService ludiumUserService;
    private ArticleService articleService;

    public ArticleController(LoginService loginService,
                             LudiumUserService ludiumUserService,
                             ArticleService articleService
    ) {
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
        this.articleService = articleService;
    }

    @PostMapping("")
    public ResponseEntity createArticle(@RequestHeader("Authorization") String authorization,
                                        @RequestParam String title,
                                        @RequestParam String content
    ) {
        String accessToken = authorization.replace("Bearer", "");
        JsonNode googleUserApiData = loginService.getUserResource(accessToken, "google");

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setUsrId(ludiumUser.getId());

        try {
            articleService.createArticle(article);
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
}
