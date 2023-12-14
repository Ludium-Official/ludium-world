package world.ludium.education.apply;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ApplyService {
    private ModuleApplyReferenceRepository moduleApplyReferenceRepository;

    public ApplyService(ModuleApplyReferenceRepository moduleApplyReferenceRepository) {
        this.moduleApplyReferenceRepository = moduleApplyReferenceRepository;
    }

    public ModuleApplyReference saveModuleApplyReference(ModuleApplyReference moduleApplyReference) {
        return moduleApplyReferenceRepository.save(moduleApplyReference);
    }

    public ModuleApplyReference getModuleApplyReference(UUID applyId) {
        return moduleApplyReferenceRepository.findById(applyId).orElseThrow();
    }
}
