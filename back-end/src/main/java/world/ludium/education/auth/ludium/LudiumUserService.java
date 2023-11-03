package world.ludium.education.auth.ludium;

import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.UUID;

@Service
public class LudiumUserService {
    private final LudiumUserRepository ludiumUserRepository;

    public LudiumUserService(LudiumUserRepository ludiumUserRepository) {
        this.ludiumUserRepository = ludiumUserRepository;
    }

    public LudiumUser getUserByGglId(BigInteger ggl_id) {
        return ludiumUserRepository.findByGglId(ggl_id);
    }

    public LudiumUser createUser(LudiumUser ludiumUser) {
        ludiumUser.setId(UUID.randomUUID());

        return ludiumUserRepository.save(ludiumUser);
    }

    public LudiumUser getUserById(UUID id) {
        return ludiumUserRepository.findById(id).orElse(null);
    }

    public void updateUser(LudiumUser ludiumUser) {
        ludiumUserRepository.save(ludiumUser);
    }
}
