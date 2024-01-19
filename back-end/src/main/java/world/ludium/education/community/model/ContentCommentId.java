package world.ludium.education.community.model;

import jakarta.persistence.Id;

import java.sql.Timestamp;
import java.util.Objects;
import java.util.UUID;

public class ContentCommentId {
    private UUID contentId;
    private UUID usrId;
    private Timestamp createAt;

    public ContentCommentId() {
    }

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

    public Timestamp getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Timestamp createAt) {
        this.createAt = createAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContentCommentId that = (ContentCommentId) o;
        return Objects.equals(contentId, that.contentId) && Objects.equals(usrId, that.usrId) && Objects.equals(createAt, that.createAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(contentId, usrId, createAt);
    }

    @Override
    public String toString() {
        return "ContentCommentId{" +
                "contentId=" + contentId +
                ", usrId=" + usrId +
                ", createAt=" + createAt +
                '}';
    }
}
