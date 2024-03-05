package world.ludium.education.community.model;

import java.util.Objects;
import java.util.UUID;

public class ContentRecommendId {
    private UUID contentId;
    private UUID usrId;

    public ContentRecommendId() {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContentRecommendId that = (ContentRecommendId) o;
        return Objects.equals(contentId, that.contentId) && Objects.equals(usrId, that.usrId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(contentId, usrId);
    }

    public String toString() {
        return "ContentRecommendId{" +
                "contentId=" + contentId +
                ", usrId=" + usrId +
                '}';
    }
}
