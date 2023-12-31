package world.ludium.education.auth.ludium;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import world.ludium.education.auth.LoginService;

import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

@Service
public class LudiumUserService {
    private final LudiumUserRepository ludiumUserRepository;
    private final LudiumUserRightRepository ludiumUserRightRepository;
    private final LoginService loginService;

    public LudiumUserService(LudiumUserRepository ludiumUserRepository,
                             LudiumUserRightRepository ludiumUserRightRepository,
                             LoginService loginService) {
        this.ludiumUserRepository = ludiumUserRepository;
        this.ludiumUserRightRepository = ludiumUserRightRepository;
        this.loginService = loginService;
    }

    public List<LudiumUser> getAllUser() {
        return ludiumUserRepository.findAll();
    }

    public LudiumUser getUser(BigInteger ggl_id) {
        return ludiumUserRepository.findByGglId(ggl_id).orElse(null);
    }

    public LudiumUser getUser(UUID id) {
        return ludiumUserRepository.findById(id).orElse(null);
    }

    public LudiumUser getUser(String accessToken) {
        try {
            var googleUserApiData = loginService.getUserResource(accessToken, "google");

            return getUser(new BigInteger(googleUserApiData.get("id").toString().replaceAll("\"", "")));
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public LudiumUser createUser(LudiumUser ludiumUser) {
        ludiumUserRepository.save(ludiumUser);
        LudiumUserRight contributor = LudiumUserRight.Contributor();
        contributor.setId(ludiumUser.getId());

        ludiumUserRightRepository.save(contributor);

        return ludiumUser;
    }

    public void updateUser(LudiumUser ludiumUser) {
        ludiumUserRepository.save(ludiumUser);
    }

    public LudiumUserRight getUserRight(UUID userid) {
        return ludiumUserRightRepository.findById(userid).orElseThrow();
    }

    public void updateUserRight(LudiumUserRight ludiumUserRight) {
        ludiumUserRightRepository.save(ludiumUserRight);
    }
}
