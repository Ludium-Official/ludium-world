package world.ludium.education.announcement;

import org.springframework.stereotype.Service;
import world.ludium.education.announcement.model.Application;
import world.ludium.education.announcement.model.ApplicationRepository;
import world.ludium.education.profile.MyApplicationDTO;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public List<MyApplicationDTO> getAllApplication(UUID usrId) {
        return applicationRepository.findAllByUsrIdOrderByCreateAt(usrId);
    }

    public List<Application> getApplication(UUID detailId, String role) {
        return applicationRepository.findAllByDetailIdAndRole(detailId, role);
    }

    public Application getApplication(UUID detailId, String role, UUID usrId) {
        return applicationRepository.findAllByDetailIdAndRoleAndUsrId(detailId, role, usrId).orElseThrow();
    }
    public Application createApplication(Application application) {
        application.setApplicationId(UUID.randomUUID());
        application.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return applicationRepository.save(application);
    }

    public Application updateApplication(Application application) {
        return applicationRepository.save(application);
    }
}
