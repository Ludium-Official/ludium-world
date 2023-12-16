package world.ludium.education.apply;

import org.springframework.stereotype.Service;
import world.ludium.education.apply.submit.SubmitApplyReferenceRepository;

import java.util.UUID;

@Service
public class ApplyService {
    private final ModuleApplyReferenceRepository moduleApplyReferenceRepository;

    public ApplyService(ModuleApplyReferenceRepository moduleApplyReferenceRepository,
                        SubmitApplyReferenceRepository submitApplyReferenceRepository) {
        this.moduleApplyReferenceRepository = moduleApplyReferenceRepository;
    }

    public ModuleApplyReference saveModuleApplyReference(ModuleApplyReference moduleApplyReference) {
        return moduleApplyReferenceRepository.save(moduleApplyReference);
    }

    public ModuleApplyReference getModuleApplyReference(UUID applyId) {
        return moduleApplyReferenceRepository.findById(applyId).orElseThrow();
    }
}
