package world.ludium.education.announcement.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import world.ludium.education.announcement.dto.DetailedAnnouncementCoWorkerDTO;
import world.ludium.education.announcement.model.DetailedAnnouncement;
import world.ludium.education.announcement.model.DetailedAnnouncementCoWorker;
import world.ludium.education.announcement.model.DetailedAnnouncementContent;
import world.ludium.education.announcement.model.DetailedAnnouncementContentComment;
import world.ludium.education.announcement.model.DetailedAnnouncementWorker;
import world.ludium.education.announcement.repository.DetailedAnnouncementCoWorkerRepository;
import world.ludium.education.announcement.repository.DetailedAnnouncementContentCommentRepository;
import world.ludium.education.announcement.repository.DetailedAnnouncementContentRepository;
import world.ludium.education.announcement.repository.DetailedAnnouncementRepository;
import world.ludium.education.announcement.repository.DetailedAnnouncementWorkerRepository;
import world.ludium.education.profile.dto.MyDetailAnnouncementDTO;

@Service
public class DetailedAnnouncementService {

  private final DetailedAnnouncementRepository detailedAnnouncementRepository;
  private final DetailedAnnouncementWorkerRepository detailedAnnouncementWorkerRepository;
  private final DetailedAnnouncementContentRepository detailedAnnouncementContentRepository;
  private final DetailedAnnouncementContentCommentRepository
      detailedAnnouncementContentCommentRepository;
  private final DetailedAnnouncementCoWorkerRepository detailedAnnouncementCoWorkerRepository;

  public DetailedAnnouncementService(DetailedAnnouncementRepository detailedAnnouncementRepository,
      DetailedAnnouncementWorkerRepository detailedAnnouncementWorkerRepository,
      DetailedAnnouncementContentRepository detailedAnnouncementContentRepository,
      DetailedAnnouncementContentCommentRepository detailedAnnouncementContentCommentRepository,
      DetailedAnnouncementCoWorkerRepository detailedAnnouncementCoWorkerRepository) {
    this.detailedAnnouncementRepository = detailedAnnouncementRepository;
    this.detailedAnnouncementWorkerRepository = detailedAnnouncementWorkerRepository;
    this.detailedAnnouncementContentRepository = detailedAnnouncementContentRepository;
    this.detailedAnnouncementContentCommentRepository
        = detailedAnnouncementContentCommentRepository;
    this.detailedAnnouncementCoWorkerRepository = detailedAnnouncementCoWorkerRepository;
  }

  public List<DetailedAnnouncement> getAllDetailedAnnouncement() {
    return detailedAnnouncementRepository.findAllByOrderByIsPinnedDescPinOrderDescCreateAtAsc();
  }

  public List<DetailedAnnouncement> getAllDetailedAnnouncement(UUID announcementId) {
    return detailedAnnouncementRepository.findAllByPostingIdOrderByCreateAt(announcementId);
  }

  public List<MyDetailAnnouncementDTO> getAllDetailedAnnouncementByWorker(UUID usrId) {
    return detailedAnnouncementRepository.findAllByWorkerOrderByCreateAt(usrId);
  }

  public List<MyDetailAnnouncementDTO> getTop4DetailedAnnouncementByWorker(UUID usrId) {
    return detailedAnnouncementRepository.findTop4ByWorkerOrderByCreateAt(usrId,
        PageRequest.of(0, 4));
  }

  public Optional<DetailedAnnouncement> getDetailedAnnouncement(UUID detailedAnnouncementId) {
    return detailedAnnouncementRepository.findById(detailedAnnouncementId);
  }

  public DetailedAnnouncementWorker getDetailedAnnouncementWorker(UUID detailedAnnouncementId,
      String role) {
    return detailedAnnouncementWorkerRepository.findByDetailIdAndRole(detailedAnnouncementId, role)
        .orElseThrow();
  }

  public List<DetailedAnnouncementContent> getAllDetailedAnnouncementContent(
      UUID detailedAnnouncementId) {
    return detailedAnnouncementContentRepository.findAllByDetailIdOrderByCreateAt(
        detailedAnnouncementId);
  }

  public List<DetailedAnnouncementContent> getAllDetailedAnnouncementContent(
      UUID detailedAnnouncementId, String status) {
    return detailedAnnouncementContentRepository.findAllByDetailIdAndStatusOrderByCreateAt(
        detailedAnnouncementId, status);
  }

  public DetailedAnnouncementContent getDetailedAnnouncementContent(
      UUID detailedAnnouncementContentId) {
    return detailedAnnouncementContentRepository.findById(detailedAnnouncementContentId)
        .orElseThrow();
  }

  public List<DetailedAnnouncementContentComment> getAllDetailedAnnouncementContentComment(
      UUID detailedAnnouncementContentId) {
    return detailedAnnouncementContentCommentRepository.findAllByDetailedContentIdOrderByCreateAt(
        detailedAnnouncementContentId);
  }

  public List<DetailedAnnouncementCoWorkerDTO> getAllDetailedAnnouncementCoWorker(
      UUID detailedAnnouncementId) {
    return detailedAnnouncementCoWorkerRepository.findAllByDetailId(detailedAnnouncementId);
  }

  public DetailedAnnouncement getDetailedAnnouncementMaxPinOrder() {
    return detailedAnnouncementRepository.findTop1ByOrderByPinOrder().orElseThrow();
  }

  public DetailedAnnouncement createDetailedAnnouncement(
      DetailedAnnouncement detailedAnnouncement) {
    detailedAnnouncement.setDetailId(UUID.randomUUID());
    return detailedAnnouncementRepository.save(detailedAnnouncement);
  }

  public DetailedAnnouncementWorker createDetailedAnnouncementWorker(
      DetailedAnnouncementWorker detailedAnnouncementWorker) {
    return detailedAnnouncementWorkerRepository.save(detailedAnnouncementWorker);
  }

  public DetailedAnnouncementContent createDetailedAnnouncementContent(
      DetailedAnnouncementContent detailedAnnouncementContent) {
    detailedAnnouncementContent.setDetailContentId(UUID.randomUUID());

    return detailedAnnouncementContentRepository.save(detailedAnnouncementContent);
  }

  public DetailedAnnouncementContentComment createDetailedAnnouncementContentComment(
      DetailedAnnouncementContentComment detailedAnnouncementContentComment) {
    detailedAnnouncementContentComment.setDetailedContentCommentId(UUID.randomUUID());

    return detailedAnnouncementContentCommentRepository.save(detailedAnnouncementContentComment);
  }

  public DetailedAnnouncementCoWorker createDetailedAnnouncementCoWorker(
      DetailedAnnouncementCoWorker detailedAnnouncementCoWorker) {
    return detailedAnnouncementCoWorkerRepository.save(detailedAnnouncementCoWorker);
  }

  public DetailedAnnouncement updateDetailedAnnouncement(
      DetailedAnnouncement detailedAnnouncement) {
    return detailedAnnouncementRepository.save(detailedAnnouncement);
  }

  public DetailedAnnouncementWorker updateDetailedAnnouncementWorker(
      DetailedAnnouncementWorker detailedAnnouncementWorker) {
    return detailedAnnouncementWorkerRepository.save(detailedAnnouncementWorker);
  }

  public DetailedAnnouncementContent updateDetailedAnnouncementContent(
      DetailedAnnouncementContent detailedAnnouncementContent) {
    return detailedAnnouncementContentRepository.save(detailedAnnouncementContent);
  }


  public void deleteDetailedAnnouncementWorker(
      DetailedAnnouncementWorker detailedAnnouncementWorker) {
    detailedAnnouncementWorkerRepository.delete(detailedAnnouncementWorker);
  }

  public void deleteDetailedAnnouncementCoWorker(
      DetailedAnnouncementCoWorker detailedAnnouncementCoWorker) {
    detailedAnnouncementCoWorkerRepository.delete(detailedAnnouncementCoWorker);
  }
}
