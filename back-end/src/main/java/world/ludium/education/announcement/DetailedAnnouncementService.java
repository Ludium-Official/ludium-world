package world.ludium.education.announcement;

import org.springframework.stereotype.Service;
import world.ludium.education.announcement.model.DetailedAnnouncement;
import world.ludium.education.announcement.model.DetailedAnnouncementRepository;

import java.util.List;
import java.util.UUID;

@Service
public class DetailedAnnouncementService {
    private final DetailedAnnouncementRepository detailedAnnouncementRepository;

    public DetailedAnnouncementService(DetailedAnnouncementRepository detailedAnnouncementRepository) {
        this.detailedAnnouncementRepository = detailedAnnouncementRepository;
    }

    public List<DetailedAnnouncement> getDetailedAnnouncementByAnnouncement(UUID announcementId) {
        return detailedAnnouncementRepository.findAllByPostingId(announcementId);
    }

    public DetailedAnnouncement createDetailedAnnouncement(DetailedAnnouncement detailedAnnouncement) {
        detailedAnnouncement.setDetailId(UUID.randomUUID());
        return detailedAnnouncementRepository.save(detailedAnnouncement);
    }
}
