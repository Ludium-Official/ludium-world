package world.ludium.education.auth.ludium;

import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.util.UUID;

public interface LudiumUserRightRepository extends JpaRepository<LudiumUserRight, UUID> { }
