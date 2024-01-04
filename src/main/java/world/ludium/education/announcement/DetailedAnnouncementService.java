package world.ludium.education.announcement;

import org.springframework.stereotype.Service;
import world.ludium.education.announcement.model.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DetailedAnnouncementService {
    private final DetailedAnnouncementRepository detailedAnnouncementRepository;
    private final DetailedAnnouncementWorkerRepository detailedAnnouncementWorkerRepository;
    private final DetailedAnnouncementContentRepository detailedAnnouncementContentRepository;

    public DetailedAnnouncementService(DetailedAnnouncementRepository detailedAnnouncementRepository,
                                       DetailedAnnouncementWorkerRepository detailedAnnouncementWorkerRepository,
                                       DetailedAnnouncementContentRepository detailedAnnouncementContentRepository) {
        this.detailedAnnouncementRepository = detailedAnnouncementRepository;
        this.detailedAnnouncementWorkerRepository = detailedAnnouncementWorkerRepository;
        this.detailedAnnouncementContentRepository = detailedAnnouncementContentRepository;
    }

    public List<DetailedAnnouncement> getAllDetailedAnnouncement() {
        return detailedAnnouncementRepository.findAll();
    }

    public List<DetailedAnnouncement> getAllDetailedAnnouncement(UUID announcementId) {
        return detailedAnnouncementRepository.findAllByPostingId(announcementId);
    }

    public Optional<DetailedAnnouncement> getDetailedAnnouncement(UUID detailedAnnouncementId) {
        return detailedAnnouncementRepository.findById(detailedAnnouncementId);
    }

    public DetailedAnnouncement createDetailedAnnouncement(DetailedAnnouncement detailedAnnouncement) {
        detailedAnnouncement.setDetailId(UUID.randomUUID());
        return detailedAnnouncementRepository.save(detailedAnnouncement);
    }


    public DetailedAnnouncement updateDetailedAnnouncement(DetailedAnnouncement detailedAnnouncement) {
        return detailedAnnouncementRepository.save(detailedAnnouncement);
    }

    public DetailedAnnouncementWorker getDetailedAnnouncementWorker(UUID detailedAnnouncementId, String role) {
        return detailedAnnouncementWorkerRepository.findByDetailIdAndRole(detailedAnnouncementId, role).orElseThrow();
    }

    public DetailedAnnouncementWorker createDetailedAnnouncementWorker(DetailedAnnouncementWorker detailedAnnouncementWorker) {
        return detailedAnnouncementWorkerRepository.save(detailedAnnouncementWorker);
    }

    public DetailedAnnouncementWorker updateDetailedAnnouncementWorker(DetailedAnnouncementWorker detailedAnnouncementWorker) {
        return detailedAnnouncementWorkerRepository.save(detailedAnnouncementWorker);
    }

    public List<DetailedAnnouncementContent> getAllDetailedAnnouncementContent(UUID detailedAnnouncementId) {
        return detailedAnnouncementContentRepository.findAllByDetailId(detailedAnnouncementId);
    }

    public DetailedAnnouncementContent createDetailedAnnouncementContent(DetailedAnnouncementContent detailedAnnouncementContent) {
        detailedAnnouncementContent.setDetailContentId(UUID.randomUUID());

        return detailedAnnouncementContentRepository.save(detailedAnnouncementContent);
    }
}
