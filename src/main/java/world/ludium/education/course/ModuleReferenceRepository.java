package world.ludium.education.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ModuleReferenceRepository extends JpaRepository<ModuleReference, UUID> {
    List<ModuleReference> findAllByMdlId(UUID mdlId);

}
