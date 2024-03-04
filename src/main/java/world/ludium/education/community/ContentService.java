package world.ludium.education.community;

import org.springframework.stereotype.Service;
import world.ludium.education.community.model.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class ContentService {
    private final ContentRepository contentRepository;
    private final ContentCommentRepository contentCommentRepository;

    public ContentService(ContentRepository contentRepository,
                          ContentCommentRepository contentCommentRepository) {
        this.contentRepository = contentRepository;
        this.contentCommentRepository = contentCommentRepository;
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
        return contentRepository.findTop1ByTypeAndVisibleOrderByCreateAtDesc(ContentType.ANNOUNCEMENT.toString(), true).orElseThrow();
    }

    public Content getLatestBanner() {
        return contentRepository.findTop1ByTypeAndVisibleOrderByCreateAtDesc(ContentType.BANNER.toString(), true).orElseThrow();
    }

    public Content getContentMaxPinOrder() {
        return contentRepository.findTop1ByVisibleOrderByPinOrder(true).orElseThrow();
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

    public Content updateContent(Content content) {
        return contentRepository.save(content);
    }

    public Content deleteContent(Content content) {
        content.setVisible(false);
        return updateContent(content);
    }
}
