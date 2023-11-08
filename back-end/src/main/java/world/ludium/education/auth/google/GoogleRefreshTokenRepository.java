package world.ludium.education.auth.google;

import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface GoogleRefreshTokenRepository extends JpaRepository<GoogleRefreshToken, BigInteger> { }
