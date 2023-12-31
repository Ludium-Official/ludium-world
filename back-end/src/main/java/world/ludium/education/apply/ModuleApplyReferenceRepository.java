package world.ludium.education.apply;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ModuleApplyReferenceRepository extends JpaRepository<ModuleApplyReference, UUID> {
    Optional<ModuleApplyReference> findByMdlId(UUID mdlId);
}
