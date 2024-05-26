package world.ludium.education.auth.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.auth.model.LudiumUserRight;

public interface LudiumUserRightRepository extends JpaRepository<LudiumUserRight, UUID> {

}
