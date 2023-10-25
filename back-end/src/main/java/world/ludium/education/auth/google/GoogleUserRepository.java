package world.ludium.education.auth.google;

import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface GoogleUserRepository extends JpaRepository<GoogleUser, BigInteger> {

}
