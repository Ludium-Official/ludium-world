package world.ludium.education.community;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
public class ContentService {
    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public List<Content> getAllContent() {
        return contentRepository.findAllByOrderByCreateAt();
    }

    public Content createContent(Content content) {
        content.setContentId(UUID.randomUUID());
        content.setCreateAt(new Timestamp(System.currentTimeMillis()));

        return contentRepository.save(content);
    }
}
