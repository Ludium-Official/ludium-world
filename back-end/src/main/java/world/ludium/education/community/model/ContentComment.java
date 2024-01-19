package world.ludium.education.community.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name="content_comment")
@IdClass(ContentCommentId.class)
public class ContentComment {
    @Id
    private UUID contentId;
    @Id
    private UUID usrId;
    private String description;
    @Id
    private Timestamp createAt;

    public UUID getContentId() {
        return contentId;
    }

    public void setContentId(UUID contentId) {
        this.contentId = contentId;
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
