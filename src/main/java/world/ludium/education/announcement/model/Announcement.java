package world.ludium.education.announcement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_posting")
public class Announcement {
    @Id
    private UUID postingId;
    private String title;
    private String description;
    private OffsetDateTime deadline;
    private Timestamp createAt;
    private boolean isPinned;
    private Integer pinOrder;

    public UUID getPostingId() {
        return postingId;
    }

    public void setPostingId(UUID postingId) {
        this.postingId = postingId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public OffsetDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(OffsetDateTime deadline) {
        this.deadline = deadline;
    }

    public Timestamp getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Timestamp createAt) {
        this.createAt = createAt;
    }

    public boolean isPinned() {
        return isPinned;
    }

    public void setPinned(boolean pinned) {
        isPinned = pinned;
    }

    public Integer getPinOrder() {
        return pinOrder;
    }

    public void setPinOrder(Integer pinOrder) {
        this.pinOrder = pinOrder;
    }
}
