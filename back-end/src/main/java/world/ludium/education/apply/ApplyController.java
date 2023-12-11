package world.ludium.education.apply;

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
import java.util.UUID;

@RestController
@RequestMapping(value = "/apply", produces = "application/json")
public class ApplyController {
    private ArticleService articleService;
    private LudiumUserService ludiumUserService;
    private LoginService loginService;

    public ApplyController(ArticleService articleService, LudiumUserService ludiumUserService, LoginService loginService) {
        this.articleService = articleService;
        this.ludiumUserService = ludiumUserService;
        this.loginService = loginService;
    }

    @GetMapping("")
    public ResponseEntity getApply() {
        try {
            var apply = articleService.getApply();
            return ResponseEntity.ok(apply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "신청서를 조회하는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }
    }

    @PostMapping("")
    public ResponseEntity createApply(@RequestParam String title,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article apply = Article.Apply();
        apply.setTitle(title);
        apply.setContent(content);
        apply.setUsrId(ludiumUser.getId());

        try {
            articleService.createArticle(apply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "공고를 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @PutMapping("{applyId}")
    public ResponseEntity createApply(@PathVariable UUID applyId,
                                      @RequestParam String title,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article apply = Article.Apply();
        apply.setId(applyId);
        apply.setTitle(title);
        apply.setContent(content);
        apply.setUsrId(ludiumUser.getId());

        try {
            articleService.updateArticle(apply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "공고를 만드는 중에 에러가 발생했습니다.");
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
