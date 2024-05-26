package world.ludium.education.auth.repository;

import java.math.BigInteger;
import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.auth.model.GoogleRefreshToken;

public interface GoogleRefreshTokenRepository extends
    JpaRepository<GoogleRefreshToken, BigInteger> {

}
