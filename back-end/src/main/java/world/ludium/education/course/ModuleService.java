package world.ludium.education.course;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final ModuleReferenceRepository moduleReferenceRepository;

    public ModuleService(ModuleRepository moduleRepository,
                         ModuleReferenceRepository moduleReferenceRepository) {
        this.moduleRepository = moduleRepository;
        this.moduleReferenceRepository = moduleReferenceRepository;
    }

    public List<Module> getAllModulesByCourse(UUID courseId) {
        return moduleRepository.findAllByCrsId(courseId);
    }

    public Module getModule(UUID moduleId) {
        return moduleRepository.findById(moduleId)
                .orElseThrow(() -> new EntityNotFoundException("모듈을 찾을 수 없습니다. ID: " + moduleId));
    }

    @Transactional
    public Module createModule(Module module, UUID articleId) {
        module.setContent("");
        module.setId(UUID.randomUUID());
        module.setCategory("");
        module.setCrsId(articleId);

        return moduleRepository.save(module);
    }

    public List<ModuleReference> getAllModuleReferenceByModuleId(UUID moduleId) {
        return moduleReferenceRepository.findAllByMdlId(moduleId);
    }
}
