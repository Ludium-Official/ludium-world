package world.ludium.education.auth.google;

import org.springframework.stereotype.Service;

import java.math.BigInteger;

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
}
