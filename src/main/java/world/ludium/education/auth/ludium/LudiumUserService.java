package world.ludium.education.auth.ludium;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

@Service
public class LudiumUserService {
    private final LudiumUserRepository ludiumUserRepository;
    private final LudiumUserRightRepository ludiumUserRightRepository;

    public LudiumUserService(LudiumUserRepository ludiumUserRepository
            , LudiumUserRightRepository ludiumUserRightRepository) {
        this.ludiumUserRepository = ludiumUserRepository;
        this.ludiumUserRightRepository = ludiumUserRightRepository;
    }

    public LudiumUser getUserByGglId(BigInteger ggl_id) {
        return ludiumUserRepository.findByGglId(ggl_id).orElse(null);
    }

    @Transactional
    public LudiumUser createUser(LudiumUser ludiumUser) {
        ludiumUserRepository.save(ludiumUser);
        LudiumUserRight contributor = LudiumUserRight.Contributor();
        contributor.setId(ludiumUser.getId());

        ludiumUserRightRepository.save(contributor);

        return ludiumUser;
    }

    public LudiumUser getUserById(UUID id) {
        return ludiumUserRepository.findById(id).orElse(null);
    }

    public void updateUser(LudiumUser ludiumUser) {
        ludiumUserRepository.save(ludiumUser);
    }

    public List<LudiumUser> getAllUser() {
        return ludiumUserRepository.findAll();
    }

    public LudiumUserRight getUserRight(UUID userid) {
        return ludiumUserRightRepository.findById(userid).orElseThrow();
    }

    public void updateUserRight(LudiumUserRight ludiumUserRight) {
        ludiumUserRightRepository.save(ludiumUserRight);
    }
}
