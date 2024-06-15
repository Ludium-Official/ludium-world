package world.ludium.education.auth.service;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.transaction.Transactional;

import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.ludium.education.auth.model.LudiumUser;
import world.ludium.education.auth.model.LudiumUserRight;
import world.ludium.education.auth.repository.LudiumUserRepository;
import world.ludium.education.auth.repository.LudiumUserRightRepository;

@Service
public class LudiumUserService {

    private static final Logger log = LogManager.getLogger(LudiumUserService.class);
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
            String userId = extractGoogleId(googleUserApiData);

            return getUser(new BigInteger(userId));
        } catch (Exception e) {
            LudiumUserService.log.error("Exception occurred: {}", e.getMessage(), e);
            return null;
        }
    }

    public Mono<LudiumUser> getUserMono(String accessToken) {
        return Mono.fromCallable(() -> loginService.getUserResource(accessToken, "google"))
                .map(googleUserApiData -> getUser(new BigInteger(extractGoogleId(googleUserApiData))))
                .onErrorResume(Exception.class, e -> {
                    LudiumUserService.log.error("Exception occurred: {}", e.getMessage(), e);

                    return Mono.empty();
                });
    }

    @Transactional
    public void createUser(LudiumUser ludiumUser) {
        ludiumUserRepository.save(ludiumUser);
        LudiumUserRight contributor = LudiumUserRight.contributor();
        contributor.setId(ludiumUser.getId());

        ludiumUserRightRepository.save(contributor);

    }

    public LudiumUser updateUser(LudiumUser ludiumUser) {
        return ludiumUserRepository.save(ludiumUser);
    }

    public LudiumUserRight getUserRight(UUID userid) {
        return ludiumUserRightRepository.findById(userid).orElseThrow();
    }

    public Boolean isAdmin(UUID usrId) {
        var right = getUserRight(usrId);

        return right.isAdm();
    }

    public void updateUserRight(LudiumUserRight ludiumUserRight) {
        ludiumUserRightRepository.save(ludiumUserRight);
    }

    public void deleteUser(LudiumUser ludiumUser) {
        LudiumUserRight contributor = LudiumUserRight.contributor();
        contributor.setId(ludiumUser.getId());

        updateUserRight(contributor);

        var deletedGglId = new BigInteger("-1");

        ludiumUser.setGglId(deletedGglId);
        ludiumUser.setNick("탈퇴한 유저");
        ludiumUser.setPhnNmb("");
        ludiumUser.setSelfIntro("");
        ludiumUser.setAvatar("");

        updateUser(ludiumUser);
    }

    private String extractGoogleId(JsonNode googleUserApiData) {
        return googleUserApiData.get("id").toString().replaceAll("\"", "");
    }
}
