package world.ludium.education.apply;

import org.springframework.stereotype.Service;

@Service
public class ApplyService {
    private ModuleApplyReferenceRepository moduleApplyReferenceRepository;

    public ApplyService(ModuleApplyReferenceRepository moduleApplyReferenceRepository) {
        this.moduleApplyReferenceRepository = moduleApplyReferenceRepository;
    }

    public ModuleApplyReference saveModuleApplyReference(ModuleApplyReference moduleApplyReference) {
        return moduleApplyReferenceRepository.save(moduleApplyReference);
    }
}
