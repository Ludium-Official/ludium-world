package world.ludium.education.announcement.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.announcement.model.ApplicationTemplate;

public interface ApplicationTemplateRepository extends JpaRepository<ApplicationTemplate, UUID> {

  Optional<ApplicationTemplate> findByDetailIdAndRole(UUID detailId, String role);
}
