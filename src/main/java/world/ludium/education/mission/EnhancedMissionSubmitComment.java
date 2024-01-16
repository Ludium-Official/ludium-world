package world.ludium.education.mission;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "mission_submit_comment")
@IdClass(EnhancedMissionSubmitCommentId.class)
public class EnhancedMissionSubmitComment {
    @Id
    private UUID missionId;
    @Id
    private UUID usrId;
    private String description;
    @Id
    private Timestamp createAt;
    private UUID commentor;

    public UUID getMissionId() {
        return missionId;
    }

    public void setMissionId(UUID missionId) {
        this.missionId = missionId;
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

    public UUID getCommentor() {
        return commentor;
    }

    public void setCommentor(UUID commentor) {
        this.commentor = commentor;
    }
}
