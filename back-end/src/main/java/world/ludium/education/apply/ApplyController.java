package world.ludium.education.apply;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.apply.submit.SubmitApplyReference;
import world.ludium.education.apply.submit.SubmitApplyService;
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
    private final ArticleService articleService;
    private final LudiumUserService ludiumUserService;
    private final LoginService loginService;
    private final ApplyService applyService;
    private final SubmitApplyService submitApplyService;

    public ApplyController(ArticleService articleService,
                           LudiumUserService ludiumUserService,
                           LoginService loginService,
                           ApplyService applyService,
                           SubmitApplyService submitApplyService) {
        this.articleService = articleService;
        this.ludiumUserService = ludiumUserService;
        this.loginService = loginService;
        this.applyService = applyService;
        this.submitApplyService = submitApplyService;
    }

    @GetMapping("")
    public ResponseEntity getApplyList() {
        try {
            var applyList = articleService.getAllApply();
            return ResponseEntity.ok(applyList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {
                        {
                            put("message", "지원서 목록을 조회하는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }
    }

    @GetMapping("/{applyId}")
    public ResponseEntity getApply(@PathVariable UUID applyId) {
        try {
            var apply = articleService.getArticle(applyId);
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
    public ResponseEntity updateApply(@PathVariable UUID applyId,
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

    @PutMapping("/{applyId}/{moduleId}")
    public ResponseEntity updateModuleApplyReference(@PathVariable UUID applyId,
                                            @PathVariable UUID moduleId
                                            ) {
        ModuleApplyReference moduleApplyReference = new ModuleApplyReference();
        moduleApplyReference.setAplId(applyId);
        moduleApplyReference.setMdlId(moduleId);

        try {
            applyService.saveModuleApplyReference(moduleApplyReference);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {
                        {
                            put("message", "지원서를 모듈과 연결하는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }
        return ResponseEntity.ok(moduleApplyReference);
    }

    @GetMapping("{applyId}/moduleReference")
    public ResponseEntity getModuleReferenceByApplyId(@PathVariable UUID applyId) {
        try {
            return ResponseEntity.ok(applyService.getModuleApplyReference(applyId));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new HashMap<String, String>() {
                        {
                            put("message", "지원서를 조회하는 중에 에러가 발생하였습니다.");
                            put("debug", e.getMessage());
                        }
                    });
        }
    }

    @PostMapping("/{applyId}")
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
        applyProvider.setTitle(title);
        applyProvider.setContent(content);
        applyProvider.setUsrId(ludiumUser.getId());

        SubmitApplyReference submitApplyReference = new SubmitApplyReference();
        submitApplyReference.setAplId(applyId);
        submitApplyReference.setUsrId(ludiumUser.getId());

        try {
            submitApplyService.createSubmitApplyReference(submitApplyReference, applyProvider);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "지원서를 제출하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }}
            );
        }

        return ResponseEntity.ok(new HashMap<String, String>() {{
            put("title", title);
            put("content", content);
        }});
    }

    @PutMapping("/{applyId}/submit/{submitId}")
    public ResponseEntity updateApplyProvider(@PathVariable UUID applyId,
                                              @PathVariable UUID submitId,
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
        applyProvider.setId(submitId);
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

    @GetMapping("{applyId}/submit")
    public ResponseEntity getSubmitApplyReference(@PathVariable UUID applyId,
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

        return ResponseEntity.ok(submitApplyService.getSubmitApplyReference(applyId, ludiumUser.getId()));
    }

    @GetMapping("{applyId}/submit/count")
    public ResponseEntity getSubmitApplyCount(@PathVariable UUID applyId) {
        return ResponseEntity.ok(submitApplyService.getSubmitApplyCount(applyId));
    }

    @GetMapping("{applyId}/submit/all")
    public ResponseEntity getSubmitApplyList(@PathVariable UUID applyId) {
        var submitList = submitApplyService
                .getSubmitApplyReference(applyId)
                .stream()
                .map(submit -> {
                    LudiumProviderDTO ludiumProviderDTO = new LudiumProviderDTO();
                    ludiumProviderDTO.setId(submit.getId());
                    ludiumProviderDTO.setContent(submit.getContent());
                    ludiumProviderDTO.setApplyId(applyId);
                    ludiumProviderDTO.setNick(ludiumUserService.getUserById(submit.getUsrId()).getNick());

                    return ludiumProviderDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(submitList);
    }

    @GetMapping("{applyId}/submit/{submitId}")
    public ResponseEntity getSubmit(@PathVariable UUID submitId) {
        return ResponseEntity.ok(articleService.getArticle(submitId));
    }
}
