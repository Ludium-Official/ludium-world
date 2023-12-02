package world.ludium.education.course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
    List<Module> findAllByCrsId(UUID crsId);
    void deleteAllByCrsId(UUID crsId);
}
