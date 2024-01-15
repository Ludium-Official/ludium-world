package world.ludium.education.learning;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import world.ludium.education.util.ResponseUtil;

import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
@RequestMapping(value = "/curriculum", produces = "application/json")
public class CurriculumController {
    private final CurriculumService curriculumService;

    private final ResponseUtil responseUtil;

    public CurriculumController(CurriculumService curriculumService, ResponseUtil responseUtil) {
        this.curriculumService = curriculumService;
        this.responseUtil = responseUtil;
    }

    @GetMapping("{curriculumId}")
    public ResponseEntity<Object> getCurriculum(@PathVariable UUID curriculumId) {
        try {
            return ResponseEntity.ok(curriculumService.getCurriculum(curriculumId));
        } catch (NoSuchElementException nse) {
            return responseUtil.getNoSuchElementExceptionMessage("커리큘럼 데이터가 없습니다.", nse.getMessage());
        } catch (Exception e) {
            return responseUtil.getExceptionMessage("커리큘럼을 조회하는 중에 에러가 발생했습니다.", e.getMessage());
        }
    }
}
