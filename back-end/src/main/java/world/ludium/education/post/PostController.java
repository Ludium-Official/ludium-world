package world.ludium.education.post;

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
@RequestMapping(value = "/post", produces = "application/json")
public class PostController {
    private LoginService loginService;
    private LudiumUserService ludiumUserService;
    private ArticleService articleService;

    public PostController(LoginService loginService,
                          LudiumUserService ludiumUserService,
                          ArticleService articleService) {
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
        this.articleService = articleService;
    }

    @GetMapping("")
    public ResponseEntity getPosts() {
        return ResponseEntity.ok(articleService.getAllArticle());
    }

    @GetMapping("/{postId}")
    public ResponseEntity getPost(@PathVariable UUID postId) {
        return ResponseEntity.ok(articleService.getArticle(postId));
    }

    @PostMapping("")
    public ResponseEntity createPost(@RequestParam String title,
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
                        put("message", "게시글을 만드는 중에 에러가 발생했습니다.");
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
