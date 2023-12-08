package world.ludium.education.make;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import world.ludium.education.article.ArticleService;

@RestController
@RequestMapping(value = "/make", produces = "application/json")
public class MakeController {
    private ArticleService articleService;

    public MakeController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping("")
    public ResponseEntity getAllAnnouncement() {
        return ResponseEntity.ok(articleService.getAllMake());
    }

}
