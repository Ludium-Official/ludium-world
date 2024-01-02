package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ApplicationTemplateRepository extends JpaRepository<ApplicationTemplate, UUID> {
    Optional<ApplicationTemplate> findByDetailIdAndRole(UUID detailId, String role);
}
