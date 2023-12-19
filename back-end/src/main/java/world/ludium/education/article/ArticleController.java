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
import java.util.UUID;

@RestController
@RequestMapping(value = "/article", produces = "application/json")
public class ArticleController {

    private LoginService loginService;
    private LudiumUserService ludiumUserService;
    private ArticleService articleService;

    public ArticleController(LoginService loginService,
                             LudiumUserService ludiumUserService,
                             ArticleService articleService) {
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
        this.articleService = articleService;
    }

    @GetMapping("")
    public ResponseEntity getArticles() {
        return ResponseEntity.ok(articleService.getAllArticle());
    }

    @GetMapping("/{articleId}")
    public ResponseEntity getArticle(@PathVariable UUID articleId) {
        return ResponseEntity.ok(articleService.getArticle(articleId));
    }

    @PostMapping("")
    public ResponseEntity createArticle(@RequestParam String title,
                                        @RequestParam String content,
                                        @RequestParam String category,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        article.setUsrId(ludiumUser.getId());
        article.setCategory(Category.valueOf(category));

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

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @PutMapping("/{articleId}")
    public ResponseEntity updateMission(@PathVariable UUID articleId,
                                        @RequestParam String title,
                                        @RequestParam String content,
                                        @RequestParam String category,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article article = new Article();
        article.setId(articleId);
        article.setTitle(title);
        article.setContent(content);
        article.setUsrId(ludiumUser.getId());
        article.setCategory(Category.valueOf(category));
        article.setVisible(true);

        try {
            articleService.updateArticle(article);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "아티클을 수정하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }
}