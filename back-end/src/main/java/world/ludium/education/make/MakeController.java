package world.ludium.education.make;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.article.ArticleService;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping(value = "/make", produces = "application/json")
public class MakeController {
    private final ArticleService articleService;
    private final LoginService loginService;
    private final LudiumUserService ludiumUserService;

    public MakeController(ArticleService articleService,
                          LoginService loginService,
                          LudiumUserService ludiumUserService) {
        this.articleService = articleService;
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
    }

    @GetMapping("")
    public ResponseEntity getAllMakeList() {
        return ResponseEntity.ok(articleService.getAllMake());
    }

    @PutMapping("/{makeId}")
    public ResponseEntity updateMake(@PathVariable UUID makeId,
                                     @RequestParam String content,
                                     @CookieValue(name = "access_token", required = false) String accessToken) {
        JsonNode googleUserApiData = null;

        try {
            googleUserApiData = loginService.getUserResource(accessToken, "google");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new HashMap<String, String>() {{
                        put("message", "인증에 실패했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        var updatedMake = articleService.getArticle(makeId);

        if(!ludiumUser.getId().equals(updatedMake.getUsrId()))
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new HashMap<String, String>(){{
                        put("message", "제작에 대한 수정 권한이 없습니다.");
                        put("debug", "이 계정이 제작자와 같은지 확인해보세요.");
                    }});

        updatedMake.setContent(content);

        return ResponseEntity.ok(articleService.updateArticle(updatedMake));
    }
}
