package world.ludium.education.article;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.learning.EnhancedArticleService;
import world.ludium.education.util.ResponseUtil;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping(value = "/article", produces = "application/json")
public class ArticleController {

    private final EnhancedArticleService articleService;
    private final ResponseUtil responseUtil;

    public ArticleController(EnhancedArticleService articleService,
                             ResponseUtil responseUtil) {
        this.articleService = articleService;
        this.responseUtil = responseUtil;
    }

    @GetMapping("/{articleId}")
    public ResponseEntity<Object> getArticle(@PathVariable UUID articleId) {
        try {
            return ResponseEntity.ok(articleService.getArticle(articleId));
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("아티클 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("아티클을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
}