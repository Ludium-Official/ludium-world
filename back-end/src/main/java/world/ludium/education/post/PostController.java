package world.ludium.education.post;

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
        return ResponseEntity.ok(articleService.getAllPost());
    }

    @GetMapping("/{postId}")
    public ResponseEntity getPost(@PathVariable UUID postId) {
        return ResponseEntity.ok(articleService.getArticle(postId));
    }

    @PostMapping("")
    public ResponseEntity createPost(@RequestParam String title,
                                        @RequestParam String content,
                                        @CookieValue(name = "access_token", required = false) String accessToken) {
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

        Article freeBoard = new Article();
        freeBoard.setTitle(title);
        freeBoard.setContent(content);
        freeBoard.setUsrId(ludiumUser.getId());
        freeBoard.setCategory(Category.FREE_BOARD);

        try {
            articleService.createArticle(freeBoard);
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
