package world.ludium.education.mission;

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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/mission", produces = "application/json")
public class MissionController {
    private LoginService loginService;
    private LudiumUserService ludiumUserService;
    private ArticleService articleService;
    private MissionSubmitService missionSubmitService;

    public MissionController(LoginService loginService,
                             LudiumUserService ludiumUserService,
                             ArticleService articleService,
                             MissionSubmitService missionSubmitService) {
        this.loginService = loginService;
        this.ludiumUserService = ludiumUserService;
        this.articleService = articleService;
        this.missionSubmitService = missionSubmitService;
    }

    @GetMapping("")
    public ResponseEntity getMissions() {
        return ResponseEntity.ok(articleService.getAllMission());
    }

    @GetMapping("/{missionId}")
    public ResponseEntity getMission(@PathVariable UUID missionId) {
        return ResponseEntity.ok(articleService.getArticle(missionId));
    }

    @PostMapping("")
    public ResponseEntity createMission(@RequestParam String title,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        Article mission = new Article();
        mission.setTitle(title);
        mission.setContent(content);
        mission.setUsrId(ludiumUser.getId());
        mission.setCategory(Category.MISSION);

        try {
            articleService.createArticle(mission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new HashMap<String, String>() {{
                        put("message", "미션을 만드는 중에 에러가 발생했습니다.");
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

    @PostMapping("/{missionId}")
    public ResponseEntity submitMission(@PathVariable UUID missionId,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        MissionSubmit missionSubmit = new MissionSubmit();

        missionSubmit.setContent(content);
        missionSubmit.setMsnId(missionId);
        missionSubmit.setUsrId(ludiumUser.getId());

        MissionSubmitHistory missionSubmitHistory = new MissionSubmitHistory();

        missionSubmitHistory.setContent(content);

        try {
            missionSubmitService.createMissionSubmit(missionSubmit);
            missionSubmitHistory.setMsnSbmId(missionSubmit.getId());
            missionSubmitService.createMissionSubmitHistory(missionSubmitHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<String, String>() {{
                        put("message", "미션을 제출하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity
                .ok(new HashMap<String, String>() {{
                    put("missionId", missionId.toString());
                    put("content", content);
                }});
    }

    @GetMapping("/{missionId}/submit")
    public ResponseEntity getMissionSubmits(@PathVariable UUID missionId) {
        List<MissionSubmit> missionSubmits = missionSubmitService.getMissionSubmits(missionId);

        return ResponseEntity.ok(missionSubmits.stream()
                .map(submit -> {
                    LudiumUser ludiumUser = ludiumUserService.getUserById(submit.getUsrId());

                    return new MissionSubmitDTO(submit.getId(),
                            submit.getContent(),
                            submit.isVldStt(),
                            ludiumUser.getNick()
                    );
                })
                .collect(Collectors.toList())
        );
    }

    @PutMapping("/{missionId}/submit/{submitId}/validate")
    public ResponseEntity validateSubmit(@PathVariable UUID submitId) {
        MissionSubmitHistory missionSubmitHistory = new MissionSubmitHistory();
        missionSubmitHistory.setMsnSbmId(submitId);
        missionSubmitHistory.setContent("검증됨");
        try {
            missionSubmitService.validateMissionSubmit(submitId);
            missionSubmitService.createMissionSubmitHistory(missionSubmitHistory);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션을 검증하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(new HashMap<>() {{
            put("id", submitId);
            put("vldStt", true);
        }});
    }

    @PutMapping("/{missionId}/submit/{submitId}/invalidate")
    public ResponseEntity invalidateSubmit(@PathVariable UUID submitId) {
        MissionSubmitHistory missionSubmitHistory = new MissionSubmitHistory();
        missionSubmitHistory.setMsnSbmId(submitId);
        missionSubmitHistory.setContent("검증해제 됨");
        try {
            missionSubmitService.invalidateMissionSubmit(submitId);
            missionSubmitService.createMissionSubmitHistory(missionSubmitHistory);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션을 검증을 해제하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(new HashMap<>() {{
            put("id", submitId);
            put("vldStt", false);
        }});
    }

    @PutMapping("/{missionId}/submit/{submitId}/edit")
    public ResponseEntity editSubmit(@PathVariable UUID submitId,
                                     @RequestParam String content) {
        MissionSubmitHistory missionSubmitHistory = new MissionSubmitHistory();
        missionSubmitHistory.setMsnSbmId(submitId);
        missionSubmitHistory.setContent(content);
        try {
            missionSubmitService.updateMissionSubmit(submitId, content);
            missionSubmitService.createMissionSubmitHistory(missionSubmitHistory);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션을 수정하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(new HashMap<>() {{
            put("id", submitId);
            put("content", content);
        }});
    }

    @GetMapping("/{missionId}/submit/{submitId}")
    public ResponseEntity getMissionSubmit(@PathVariable UUID submitId) {
        return ResponseEntity.ok(missionSubmitService.getMissionSubmit(submitId));
    }

    @GetMapping("/{missionId}/submit/{submitId}/history")
    public ResponseEntity getMissionSubmitHistory(@PathVariable UUID submitId) {
        return ResponseEntity.ok(missionSubmitService.getMissionSubmitHistory(submitId));
    }

    @GetMapping("/{missionId}/submit/{submitId}/comment")
    public ResponseEntity<List<MissionSubmitCommentDTO>> getSubmitComments(@PathVariable UUID submitId) {
        List<MissionSubmitComment> missionSubmitComments = missionSubmitService.getMissionSubmitComments(submitId);

        return ResponseEntity.ok(missionSubmitComments.stream()
                .map(comment -> {
                    LudiumUser ludiumUser = ludiumUserService.getUserById(comment.getUsrId());
                    MissionSubmitCommentDTO missionSubmitCommentDTO = new MissionSubmitCommentDTO();

                    missionSubmitCommentDTO.setId(comment.getId());
                    missionSubmitCommentDTO.setContent(comment.getContent());
                    missionSubmitCommentDTO.setCreateAt(comment.getCreateAt());
                    missionSubmitCommentDTO.setNick(ludiumUser.getNick());

                    return missionSubmitCommentDTO;
                })
                .collect(Collectors.toList())
        );
    }

    @PostMapping("/{missionId}/submit/{submitId}")
    public ResponseEntity createSubmitComment(@PathVariable UUID submitId,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        MissionSubmitComment missionSubmitComment = new MissionSubmitComment();

        missionSubmitComment.setContent(content);
        missionSubmitComment.setMsnSbmId(submitId);
        missionSubmitComment.setUsrId(ludiumUser.getId());

        try {
            missionSubmitService.createMissionSubmitComment(missionSubmitComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션 코멘트를 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        MissionSubmitCommentDTO missionSubmitCommentDTO = new MissionSubmitCommentDTO();
        missionSubmitCommentDTO.setId(missionSubmitComment.getId());
        missionSubmitCommentDTO.setContent(missionSubmitComment.getContent());
        missionSubmitCommentDTO.setCreateAt(missionSubmitComment.getCreateAt());
        missionSubmitCommentDTO.setNick(ludiumUser.getNick());

        return ResponseEntity.ok(missionSubmitCommentDTO);
    }

    @PutMapping("/{missionId}/submit/{submitId}/{commentId}")
    public ResponseEntity updateSubmitComment(@PathVariable UUID commentId,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        MissionSubmitComment missionSubmitComment = missionSubmitService.getMissionSubmitComment(commentId);

        if(!missionSubmitComment.getUsrId().equals(ludiumUser.getId())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션 코멘트를 삭제하는 중에 에러가 발생했습니다.");
                        put("debug", "아이디가 다름");
                    }});
        }

        try {
            missionSubmitComment.setContent(content);
            missionSubmitService.updateMissionSubmitComment(missionSubmitComment);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션 코멘트를 삭제하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        MissionSubmitCommentDTO missionSubmitCommentDTO = new MissionSubmitCommentDTO();
        missionSubmitCommentDTO.setId(missionSubmitComment.getId());
        missionSubmitCommentDTO.setContent(missionSubmitComment.getContent());
        missionSubmitCommentDTO.setCreateAt(missionSubmitComment.getCreateAt());
        missionSubmitCommentDTO.setNick(ludiumUser.getNick());


        return ResponseEntity.ok(missionSubmitCommentDTO);
    }

    @DeleteMapping("/{missionId}/submit/{submitId}/{commentId}")
    public ResponseEntity deleteSubmitComment(@PathVariable UUID commentId,
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

        LudiumUser ludiumUser = ludiumUserService.getUserByGglId(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));

        MissionSubmitComment missionSubmitComment = missionSubmitService.getMissionSubmitComment(commentId);

        if(!missionSubmitComment.getUsrId().equals(ludiumUser.getId())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션 코멘트를 삭제하는 중에 에러가 발생했습니다.");
                        put("debug", "아이디가 다름");
                    }});
        }

        try {
            missionSubmitService.deleteMissionSubmitComment(missionSubmitComment);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션 코멘트를 삭제하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }


        return ResponseEntity.ok(commentId);
    }

    @DeleteMapping("/{missionId}")
    public ResponseEntity deleteMission(@PathVariable UUID missionId) {
        try {
            missionSubmitService.deleteMissionSubmit(missionId);
            articleService.deleteArticle(missionId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "미션 삭제 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(missionId);
    }
}
