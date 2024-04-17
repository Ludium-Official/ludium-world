package world.ludium.education.auth.repository;

import java.math.BigInteger;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.auth.model.GoogleUser;

public interface GoogleUserRepository extends JpaRepository<GoogleUser, BigInteger> {

}
