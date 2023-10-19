package world.ludium.education.community;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import world.ludium.education.community.model.Content;
import world.ludium.education.community.model.ContentComment;
import world.ludium.education.community.model.ContentRecommend;
import world.ludium.education.community.model.ContentRecommendId;
import world.ludium.education.community.model.ContentType;
import world.ludium.education.community.repository.ContentCommentRepository;
import world.ludium.education.community.repository.ContentRecommendRepository;
import world.ludium.education.community.repository.ContentRepository;

@Service
public class ContentService {

  private final ContentRepository contentRepository;
  private final ContentCommentRepository contentCommentRepository;
  private final ContentRecommendRepository contentRecommendRepository;

  public ContentService(ContentRepository contentRepository,
      ContentCommentRepository contentCommentRepository,
      ContentRecommendRepository contentRecommendRepository) {
    this.contentRepository = contentRepository;
    this.contentCommentRepository = contentCommentRepository;
    this.contentRecommendRepository = contentRecommendRepository;
  }

  public List<Content> getAllContent() {
    return contentRepository.findAllByVisibleOrderByIsPinnedDescPinOrderDescCreateAtDesc(true);
  }


  public Content getContent(UUID contentId) {
    return contentRepository.findByContentIdAndVisible(contentId, true).orElseThrow();
  }

  public List<ContentComment> getAllContentComment(UUID contentId) {
    return contentCommentRepository.findAllByContentIdOrderByCreateAt(contentId);
  }


  public Content getLatestAnnouncement() {
    return contentRepository.findTop1ByTypeAndVisibleOrderByCreateAtDesc(
        ContentType.ANNOUNCEMENT.toString(), true).orElseThrow();
  }

  public Content getLatestBanner() {
    return contentRepository.findTop1ByTypeAndVisibleOrderByCreateAtDesc(
        ContentType.BANNER.toString(), true).orElseThrow();
  }

  public Content getContentMaxPinOrder() {
    return contentRepository.findTop1ByVisibleOrderByPinOrder(true).orElseThrow();
  }

  public ContentRecommend getContentRecommend(ContentRecommendId contentRecommendId) {
    return contentRecommendRepository.findById(contentRecommendId).orElseThrow();
  }

  public boolean isContentRecommendExist(ContentRecommendId contentRecommendId) {
    return contentRecommendRepository.existsById(contentRecommendId);
  }

  public long getContentRecommendCount(UUID contentId) {
    return contentRecommendRepository.countByContentId(contentId);
  }

  public Content createContent(Content content) {
    content.setContentId(UUID.randomUUID());
    content.setCreateAt(new Timestamp(System.currentTimeMillis()));
    content.setVisible(true);
    content.setPinned(false);
    content.setPinOrder(-1);

    return contentRepository.save(content);
  }

  public ContentComment createContentComment(ContentComment contentComment) {
    contentComment.setCreateAt(new Timestamp(System.currentTimeMillis()));

    return contentCommentRepository.save(contentComment);
  }

  public ContentRecommend createContentRecommend(ContentRecommend contentRecommend) {
    contentRecommend.setCreateAt(new Timestamp(System.currentTimeMillis()));

    return contentRecommendRepository.save(contentRecommend);
  }

  public Content updateContent(Content content) {
    return contentRepository.save(content);
  }

  public Content deleteContent(Content content) {
    content.setVisible(false);
    return updateContent(content);
  }

  public void deleteContentRecommend(ContentRecommendId contentRecommendId) {
    contentRecommendRepository.deleteById(contentRecommendId);
  }
}
