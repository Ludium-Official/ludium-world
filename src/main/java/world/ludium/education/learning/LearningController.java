package world.ludium.education.learning;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.auth.ludium.LudiumUserService;
import world.ludium.education.learning.model.Curriculum;
import world.ludium.education.learning.model.Learning;
import world.ludium.education.learning.model.Mission;
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
    private final CurriculumService curriculumService;
    private final MissionService missionService;

    public LearningController(LearningService learningService,
                              LudiumUserService ludiumUserService,
                              ResponseUtil responseUtil,
                              CurriculumService curriculumService,
                              MissionService missionService) {
        this.learningService = learningService;
        this.ludiumUserService = ludiumUserService;
        this.responseUtil = responseUtil;
        this.curriculumService = curriculumService;
        this.missionService = missionService;
    }

    @GetMapping("")
    public ResponseEntity<Object> getAllLearning() {
        try {
            var learningList = learningService.getAllLearning();

            if (learningList.isEmpty()) throw new NoSuchElementException();

            return ResponseEntity.ok(learningList);
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("학습 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("학습을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{learningId}")
    public ResponseEntity<Object> getLearning(@PathVariable UUID learningId) {
        try {
            return ResponseEntity.ok(learningService.getLearning(learningId));
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("학습 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("학습을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{learningId}/curriculum")
    public ResponseEntity<Object> getAllCurriculum(@PathVariable UUID learningId){
        try {
            var curriculumList = curriculumService.getAllCurriculum(learningId);

            if (curriculumList.isEmpty()) throw new NoSuchElementException();

            return ResponseEntity.ok(curriculumList);
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("커리큘럼 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("커리큘럼을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @GetMapping("/{learningId}/{curriculumId}/mission")
    public ResponseEntity<Object> getAllMission(@PathVariable UUID learningId,
                                                @PathVariable UUID curriculumId) {
        try {
            var missionList = missionService.getAllMission(curriculumId);

            if (missionList.isEmpty()) throw new NoSuchElementException();

            return ResponseEntity.ok(missionList);
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("미션 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
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
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("학습을 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("/{learningId}")
    public ResponseEntity<Object> createCurriculum(@PathVariable UUID learningId,
                                                   @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        var curriculum = new Curriculum();
        curriculum.setTitle("");
        curriculum.setDescription("");
        curriculum.setUsrId(ludiumUser.getId());
        curriculum.setPostingId(learningId);


        try {
            return ResponseEntity.ok(curriculumService.createCurriculum(curriculum));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("학습을 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PostMapping("/{learningId}/{curriculumId}/mission")
    public ResponseEntity<Object> createMission(@PathVariable UUID learningId,
                                                @PathVariable UUID curriculumId,
                                                @CookieValue(name = "access_token", required = false) String accessToken){
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        var mission = new Mission();
        mission.setCurriculumId(curriculumId);
        mission.setTitle("");
        mission.setDescription("");
        mission.setUsrId(ludiumUser.getId());
        mission.setMissionSubmitForm("");

        try {
            return ResponseEntity.ok(missionService.createMission(mission));
        } catch (Exception e){
            return responseUtil.getExceptionMessage("미션을 만드는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("/{learningId}")
    public ResponseEntity<Object> updateLearning(@RequestBody Learning learning,
                                                 @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        if (!ludiumUser.getId().equals(learning.getUsrId()))
            return responseUtil.getForbiddenExceptionMessage(new ResponseException("학습 수정자 정보가 일치하지 않습니다.", ""));

        try {
            return ResponseEntity.ok(learningService.updateLearning(learning));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("학습을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
    
    @PutMapping("/{learningId}/{curriculumId}")
    public ResponseEntity<Object> updateCurriculum(@RequestBody Curriculum curriculum,
                                                   @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();

        if (!ludiumUser.getId().equals(curriculum.getUsrId()))
            return responseUtil.getForbiddenExceptionMessage(new ResponseException("커리큘럼 수정자 정보가 일치하지 않습니다.", ""));

        try {
            return ResponseEntity.ok(curriculumService.updateCurriculum(curriculum));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("커리큘럼을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }

    @PutMapping("/{learningId}/{curriculumId}/mission")
    public ResponseEntity<Object> updateMission(@RequestBody Mission mission,
                                                @CookieValue(name = "access_token", required = false) String accessToken) {
        var ludiumUser = ludiumUserService.getUser(accessToken);

        if (ludiumUser == null)
            return responseUtil.getUnAuthorizedMessage();
        
        if (!ludiumUser.getId().equals(mission.getUsrId()))
            return responseUtil.getForbiddenExceptionMessage(new ResponseException("미션 수정자 정보가 일치하지 않습니다.", ""));

        try {
            return ResponseEntity.ok(missionService.updateMission(mission));
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("미션을 수정하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
}
