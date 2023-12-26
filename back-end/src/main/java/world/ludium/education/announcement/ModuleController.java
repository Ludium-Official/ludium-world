package world.ludium.education.announcement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import world.ludium.education.article.ArticleService;
import world.ludium.education.course.Module;
import world.ludium.education.course.ModuleDTO;
import world.ludium.education.course.ModuleReference;
import world.ludium.education.course.ModuleService;
import world.ludium.education.make.Category;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/module", produces = "application/json")
public class ModuleController {

    private ModuleService moduleService;
    private ArticleService articleService;

    public ModuleController(ModuleService moduleService,
                            ArticleService articleService) {
        this.moduleService = moduleService;
        this.articleService = articleService;
    }

    @GetMapping("")
    public ResponseEntity getModuleList() {
        return ResponseEntity.ok(articleService.getAllModule());
    }

    @GetMapping("/{moduleId}")
    public ResponseEntity getModule(@PathVariable UUID moduleId) {
        ModuleDTO moduleDTO = new ModuleDTO();

        try {
            Module module = moduleService.getModule(moduleId);
            List<ModuleReference> moduleReferences = moduleService.getAllModuleReferenceByModuleId(moduleId);

            moduleDTO.setId(moduleId);
            moduleDTO.setTitle(module.getTitle());
            moduleDTO.setContent(module.getContent());
            moduleDTO.setCategory(module.getCategory().toString());
            moduleDTO.setModuleReferences(moduleReferences);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "모듈을 불러오는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(moduleDTO);
    }

    @PostMapping("/{parentId}")
    public ResponseEntity createModule(@PathVariable UUID parentId,
                                       @RequestParam String title
    ) {
        Module module = new Module();
        module.setTitle(title);
        module.setCategory(Category.MODULE);

        try {
            moduleService.createModule(module, parentId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "모듈을 만드는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(module);
    }

    @DeleteMapping("/{moduleId}")
    public ResponseEntity deleteModule(@PathVariable UUID moduleId) {
        var disabledModule = articleService.getArticle(moduleId);

        disabledModule.setVisible(false);
        try {
            articleService.updateArticle(disabledModule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "모듈을 삭제하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(new HashMap<>() {{
            put("id", moduleId);
        }});
    }

    @PutMapping("/{moduleId}/order")
    public ResponseEntity updateModuleOrder(@PathVariable UUID moduleId,
                                            @RequestParam int orderNo) {
        var module = articleService.getArticle(moduleId);

        module.setOrderNo(orderNo);

        try {
            articleService.updateArticle(module);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new HashMap<>() {{
                        put("message", "모듈을 순서를 변경하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(new HashMap<>() {{
            put("id", moduleId);
        }});
    }

    @GetMapping("/{moduleId}/apply")
    public ResponseEntity getModuleApply(@PathVariable UUID moduleId) {
        try {
            var applyReference = moduleService.getApply(moduleId);

            return ResponseEntity.ok(articleService.getArticle(applyReference.getAplId()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new HashMap<>() {{
                        put("message", "모듈의 지원서를 조회하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }
    }

    @GetMapping("/{moduleId}/make")
    public ResponseEntity getMakeList(@PathVariable UUID moduleId) {
        return ResponseEntity.ok(moduleService.getAllModulesByCourse(moduleId));
    }

    @PutMapping("/{moduleId}/{makeId}/{ownerId}")
    public ResponseEntity updateMakeOwner(@PathVariable UUID makeId,
                                          @PathVariable UUID ownerId) {
        var updatedMake = articleService.getArticle(makeId);

        updatedMake.setUsrId(ownerId);

        try {
            articleService.updateArticle(updatedMake);
        } catch(Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new HashMap<>() {{
                        put("message", "제작자 권한을 할당하는 중에 에러가 발생했습니다.");
                        put("debug", e.getMessage());
                    }});
        }

        return ResponseEntity.ok(updatedMake);
    }
}
