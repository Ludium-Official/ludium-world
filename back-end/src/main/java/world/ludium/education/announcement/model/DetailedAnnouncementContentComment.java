package world.ludium.education.announcement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name="detailed_posting_content_comment")
public class DetailedAnnouncementContentComment {
    @Id
    private UUID detailedContentCommentId;
    private UUID detailedContentId;
    private UUID usrId;
    private String description;
    private Timestamp createAt;

    public UUID getDetailedContentCommentId() {
        return detailedContentCommentId;
    }

    public void setDetailedContentCommentId(UUID detailedContentCommentId) {
        this.detailedContentCommentId = detailedContentCommentId;
    }

    public UUID getDetailedContentId() {
        return detailedContentId;
    }

    public void setDetailedContentId(UUID detailedContentId) {
        this.detailedContentId = detailedContentId;
    }

    public UUID getUsrId() {
        return usrId;
    }

    public void setUsrId(UUID usrId) {
        this.usrId = usrId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Timestamp createAt) {
        this.createAt = createAt;
    }
}
