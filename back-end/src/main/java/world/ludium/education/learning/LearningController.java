package world.ludium.education.learning;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.util.ResponseException;
import world.ludium.education.util.ResponseUtil;

import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping(value = "/learning", produces = "application/json")
public class LearningController {
    private final LearningService learningService;
    private final LudiumUserService ludiumUserService;
    private final ResponseUtil responseUtil;

    public LearningController(LearningService learningService,
                              LudiumUserService ludiumUserService,
                              ResponseUtil responseUtil) {
        this.learningService = learningService;
        this.ludiumUserService = ludiumUserService;
        this.responseUtil = responseUtil;

    }

    @GetMapping("")
    public ResponseEntity<Object> getAllLearning() {
        try {
            var learningList = learningService.getAllLearning();

            if(learningList.isEmpty()) throw new NoSuchElementException();

            return ResponseEntity.ok(learningList);
        } catch(NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("학습 데이터가 없습니다.", nse.getMessage());
        } catch(Exception e) {
            return responseUtil.getExceptionMessage("학습을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{learningId}")
    public ResponseEntity<Object> getLearning(@PathVariable UUID learningId) {
        try {
            return ResponseEntity.ok(learningService.getLearning(learningId));
        } catch(NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("학습 데이터가 없습니다.", nse.getMessage());
        } catch(Exception e) {
            return responseUtil.getExceptionMessage("학습을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<Object> createLearning(@RequestBody Learning learning,
                                                 @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        learning.setUsrId(ludiumUser.getId());

        try {
            return ResponseEntity.ok(learningService.createLearning(learning));
        } catch(Exception e) {
            return responseUtil.getExceptionMessage("학습을 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("/{learningId}")
    public ResponseEntity<Object> updateLearning(@RequestBody Learning learning,
                                                 @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        if(!ludiumUser.getId().equals(learning.getUsrId()))
            return responseUtil.getForbiddenExceptionMessage(new ResponseException("학습 생성자 정보가 일치하지 않습니다.", ""));

        try {
            return ResponseEntity.ok(learningService.updateLearning(learning));
        } catch(Exception e) {
            return responseUtil.getExceptionMessage("학습을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
}
