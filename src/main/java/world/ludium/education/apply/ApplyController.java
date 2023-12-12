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
import java.util.stream.Collectors;

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
                            put("message", "지원서를 조회하는 중에 에러가 발생하였습니다.");
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
                        put("message", "지원서를 만드는 중에 에러가 발생했습니다.");
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
                        put("message", "지원서를 수정하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @GetMapping("/provider")
    public ResponseEntity getProviderApply(@CookieValue(name = "access_token", required = false) String accessToken) {
        JsonNode googleUserApiData = null;

        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "로그인을 먼저 해주세요");
                            put("debug", "로그인을 안했음");
                        }
                    });
        }

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

        var ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        if (ludiumUser == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "회원정보를 조회하는 중에 에러가 발생하였습니다.");
                            put("debug", "403");
                        }
                    });
        }

        try {
            var apply = articleService.getProviderApplyByUsrId(ludiumUser.getId());
            return ResponseEntity.ok(apply);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "지원서를 조회하는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }
    }

    @PostMapping("/provider")
    public ResponseEntity createApplyProvider(@RequestParam String title,
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

        Article applyProvider = Article.ApplyProvider();
        applyProvider.setTitle(title);
        applyProvider.setContent(content);
        applyProvider.setUsrId(ludiumUser.getId());

        try {
            articleService.createArticle(applyProvider);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "지원서를 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @PutMapping("/provider/{applyId}")
    public ResponseEntity createApplyProvider(@PathVariable UUID applyId,
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

        Article applyProvider = Article.ApplyProvider();
        applyProvider.setId(applyId);
        applyProvider.setTitle(title);
        applyProvider.setContent(content);
        applyProvider.setUsrId(ludiumUser.getId());

        try {
            articleService.updateArticle(applyProvider);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "지원서를 수정하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @GetMapping("/provider/all")
    public ResponseEntity getProviderApplyList() {
        var providerDTOList = articleService.getAllProviderApply().stream().map(providerApply -> {
            var usrId = providerApply.getUsrId();
            var ludiumUser = ludiumUserService.getUserById(usrId);
            var ludiumProviderDTO = new LudiumProviderDTO();

            ludiumProviderDTO.setId(ludiumUser.getId());
            ludiumProviderDTO.setNick(ludiumUser.getNick());
            ludiumProviderDTO.setContent(providerApply.getContent());
            ludiumProviderDTO.setApplyId(providerApply.getId());

            return ludiumProviderDTO;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(providerDTOList);
    }

    @GetMapping("/provider/{providerApplyId}")
    public ResponseEntity getProviderApply(@PathVariable UUID providerApplyId) {
        try {
            var providerApply = articleService.getProviderApply(providerApplyId);
            var usrId = providerApply.getUsrId();
            var ludiumUser = ludiumUserService.getUserById(usrId);
            var ludiumProviderDTO = new LudiumProviderDTO();

            ludiumProviderDTO.setId(ludiumUser.getId());
            ludiumProviderDTO.setNick(ludiumUser.getNick());
            ludiumProviderDTO.setContent(providerApply.getContent());
            ludiumProviderDTO.setApplyId(providerApply.getId());

            return ResponseEntity.ok(ludiumProviderDTO);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new HashMap<>() {{
                        put("message", "지원서를 조회하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                      }}
                    );
        }
    }
}
