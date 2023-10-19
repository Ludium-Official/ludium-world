package world.ludium.education.auth.repository;

import java.math.BigInteger;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.auth.model.LudiumUser;

public interface LudiumUserRepository extends JpaRepository<LudiumUser, UUID> {

  Optional<LudiumUser> findByGglId(BigInteger gglId);
}
