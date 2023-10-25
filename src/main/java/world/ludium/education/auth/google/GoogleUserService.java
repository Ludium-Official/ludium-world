package world.ludium.education.auth.google;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;

@Service
public class GoogleUserService {
    private GoogleUserRepository googleUserRepository;

    public GoogleUserService(GoogleUserRepository googleUserRepository) {
        this.googleUserRepository = googleUserRepository;
    }

    public GoogleUser getUserById(BigInteger id) {
        return googleUserRepository.findById(id).orElse(null);
    }

    public GoogleUser createUser(GoogleUser googleUser) {
        return googleUserRepository.save(googleUser);
    }
}
