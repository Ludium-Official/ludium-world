package world.ludium.education.auth.ludium;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class LudiumUserService {
    private final LudiumUserRepository ludiumUserRepository;

    public LudiumUserService(LudiumUserRepository ludiumUserRepository) {
        this.ludiumUserRepository = ludiumUserRepository;
    }

    public LudiumUser createUser(LudiumUser ludiumUser) {
        ludiumUser.setId(UUID.randomUUID());

        return ludiumUserRepository.save(ludiumUser);
    }
}
