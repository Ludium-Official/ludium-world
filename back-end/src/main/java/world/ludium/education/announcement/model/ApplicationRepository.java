package world.ludium.education.announcement.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findAllByDetailIdAndRole(UUID detailId, String role);

    Optional<Application> findAllByDetailIdAndRoleAndUsrId(UUID detailId, String role, UUID usrId);
}
