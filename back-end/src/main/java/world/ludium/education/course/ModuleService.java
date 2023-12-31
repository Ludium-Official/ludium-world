package world.ludium.education.course;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import world.ludium.education.apply.ModuleApplyReference;
import world.ludium.education.apply.ModuleApplyReferenceRepository;
import world.ludium.education.make.Category;

import java.util.List;
import java.util.UUID;

@Service
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final ModuleReferenceRepository moduleReferenceRepository;
    private final ModuleApplyReferenceRepository moduleApplyReferenceRepository;

    public ModuleService(ModuleRepository moduleRepository,
                         ModuleReferenceRepository moduleReferenceRepository,
                         ModuleApplyReferenceRepository moduleApplyReferenceRepository) {
        this.moduleRepository = moduleRepository;
        this.moduleReferenceRepository = moduleReferenceRepository;
        this.moduleApplyReferenceRepository = moduleApplyReferenceRepository;
    }

    public List<Module> getAllModulesByCourse(UUID courseId) {
        return moduleRepository.findAllByCrsId(courseId);
    }

    public List<Module> getAllModulesByAnnouncement(UUID announcementId) {
        return moduleRepository.findAllByCrsId(announcementId);
    }

    public Module getModule(UUID moduleId) {
        return moduleRepository.findById(moduleId)
                .orElseThrow(() -> new EntityNotFoundException("모듈을 찾을 수 없습니다. ID: " + moduleId));
    }

    @Transactional
    public Module createModule(Module module, UUID articleId) {
        module.setContent("");
        module.setId(UUID.randomUUID());
        module.setCrsId(articleId);

        return moduleRepository.save(module);
    }

    public List<ModuleReference> getAllModuleReferenceByModuleId(UUID moduleId) {
        return moduleReferenceRepository.findAllByMdlId(moduleId);
    }

    public ModuleReference updateModuleReference(UUID moduleId,
                                      UUID articleId) {
        ModuleReference moduleReference = moduleReferenceRepository.findByMdlIdAndArtId(moduleId, articleId);

        if(moduleReference == null) {
            moduleReference = new ModuleReference();
            moduleReference.setMdlId(moduleId);
            moduleReference.setArtId(articleId);

            moduleReferenceRepository.save(moduleReference);
        } else {
            moduleReferenceRepository.delete(moduleReference);
        }

        return moduleReference;
    }

    public Module updateModule(Module module) {
        return moduleRepository.save(module);
    }

    public ModuleApplyReference getApply(UUID moduleId) {
        return moduleApplyReferenceRepository.findByMdlId(moduleId).orElseThrow();
    }
}
