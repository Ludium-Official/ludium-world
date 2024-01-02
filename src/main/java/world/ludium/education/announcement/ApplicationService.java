package world.ludium.education.announcement;

import org.springframework.stereotype.Service;
import world.ludium.education.announcement.model.Application;
import world.ludium.education.announcement.model.ApplicationRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public List<Application> getApplication(UUID detailId, String role) {
        return applicationRepository.findAllByDetailIdAndRole(detailId, role);
    }
}
