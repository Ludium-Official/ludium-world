package world.ludium.education.course;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ModuleService {
    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    @Transactional
    public Module createModule(Module module, UUID articleId) {
        module.setContent("");
        module.setId(UUID.randomUUID());
        module.setCategory("");
        module.setCrsId(articleId);

        return moduleRepository.save(module);
    }
}
