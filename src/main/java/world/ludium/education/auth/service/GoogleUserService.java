package world.ludium.education.auth.service;

import java.math.BigInteger;
import org.springframework.stereotype.Service;
import world.ludium.education.auth.model.GoogleRefreshToken;
import world.ludium.education.auth.model.GoogleUser;
import world.ludium.education.auth.repository.GoogleRefreshTokenRepository;
import world.ludium.education.auth.repository.GoogleUserRepository;

@Service
public class GoogleUserService {

  private GoogleUserRepository googleUserRepository;
  private GoogleRefreshTokenRepository googleRefreshTokenRepository;

  public GoogleUserService(GoogleUserRepository googleUserRepository,
      GoogleRefreshTokenRepository googleRefreshTokenRepository) {
    this.googleUserRepository = googleUserRepository;
    this.googleRefreshTokenRepository = googleRefreshTokenRepository;
  }

  public GoogleUser getUserById(BigInteger id) {
    return googleUserRepository.findById(id).orElse(null);
  }

  public GoogleUser createUser(GoogleUser googleUser) {
    return googleUserRepository.save(googleUser);
  }

  public GoogleRefreshToken createUserRefreshToken(GoogleRefreshToken googleRefreshToken) {
    return googleRefreshTokenRepository.save(googleRefreshToken);
  }

  public GoogleRefreshToken getUserRefreshToken(BigInteger id) {
    return googleRefreshTokenRepository.findById(id).orElse(null);
  }

  public void deleteUser(BigInteger id) {
    var googleUser = googleUserRepository.findById(id).orElseThrow();

    googleUserRepository.delete(googleUser);
  }
}
