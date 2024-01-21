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
        return contentRepository.findAllByOrderByCreateAt();
    }


    public Content getContent(UUID contentId) {
        return contentRepository.findById(contentId).orElseThrow();
    }

    public Content createContent(Content content) {
        content.setContentId(UUID.randomUUID());
        content.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return contentRepository.save(content);
    }

    public Content updateContent(Content content) {
        return contentRepository.save(content);
    }

    public List<ContentComment> getAllContentComment(UUID contentId) {
        return contentCommentRepository.findAllByContentIdOrderByCreateAt(contentId);
    }

    public ContentComment createContentComment(ContentComment contentComment) {
        contentComment.setCreateAt(new Timestamp(System.currentTimeMillis()));
        return contentCommentRepository.save(contentComment);
    }

    public Content getLatestAnnouncement() {
        return contentRepository.findTop1ByTypeOrderByCreateAtDesc(ContentType.ANNOUNCEMENT.toString()).orElseThrow();
    }
}
