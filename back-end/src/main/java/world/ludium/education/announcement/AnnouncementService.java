package world.ludium.education.announcement;

import org.springframework.stereotype.Service;
import world.ludium.education.announcement.model.Announcement;
import world.ludium.education.announcement.model.AnnouncementRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> getAllAnnouncement() {
        return announcementRepository.findAll();
    }
    public Optional<Announcement> getAnnouncement(UUID announcementId) { return announcementRepository.findById(announcementId); }

    public Announcement createAnnouncement(Announcement announcement) {
        announcement.setPostingId(UUID.randomUUID());
        return announcementRepository.save(announcement);
    }

    public Announcement updateAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
}
