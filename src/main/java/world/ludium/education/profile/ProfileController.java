package world.ludium.education.profile;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.announcement.ApplicationService;
import world.ludium.education.article.ArticleService;
import world.ludium.education.auth.LoginService;
import world.ludium.education.auth.ludium.LudiumUser;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.mission.MissionSubmitService;
import world.ludium.education.util.ResponseUtil;

import java.util.UUID;

@RestController
@RequestMapping(value = "/profile", produces = "application/json")
public class ProfileController {
    private final LudiumUserService ludiumUserService;
    private final ResponseUtil responseUtil;
    private final ApplicationService applicationService;

    public ProfileController(LudiumUserService ludiumUserService,
                             ResponseUtil responseUtil,
                             ApplicationService applicationService) {
        this.ludiumUserService = ludiumUserService;
        this.responseUtil = responseUtil;
        this.applicationService = applicationService;
    }

    @GetMapping("")
    public ResponseEntity<Object> getProfile(@CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if(ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        return ResponseEntity.ok(ludiumUser);
    }

    @GetMapping("{userId}/application")
    public ResponseEntity<Object> getAllApplication(@PathVariable UUID userId) {
        try {
            var applicationList = applicationService.getAllApplication(userId);

            if(applicationList.isEmpty()) return responseUtil.getNoSuchElementExceptionMessage("지원서 데이터가 없습니다.", "");

            return ResponseEntity.ok(applicationList);
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("지원서를 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }


    @PutMapping("")
    public ResponseEntity<Object> updateProfile(@CookieValue(name = "access_token", required = false) String accessToken,
                                        @RequestBody LudiumUser user) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if(ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        user.setId(ludiumUser.getId());
        user.setGglId(ludiumUser.getGglId());

        try {
            return ResponseEntity.ok(ludiumUserService.updateUser(user));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("사용자를 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("{userId}")
    public ResponseEntity getUserProfile(@PathVariable UUID userId) {
        return ResponseEntity.ok(ludiumUserService.getUser(userId));
    }
}
