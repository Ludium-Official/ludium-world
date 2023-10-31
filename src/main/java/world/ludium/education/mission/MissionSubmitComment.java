package world.ludium.education.mission;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_msn_sbm_cm")
public class MissionSubmitComment {
    @Id
    private UUID id;
    private String content;
    private UUID msnSbmId;
    private UUID usrId;
    private ZonedDateTime createAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getMsnSbmId() {
        return msnSbmId;
    }

    public void setMsnSbmId(UUID msnSbmId) {
        this.msnSbmId = msnSbmId;
    }

    public UUID getUsrId() {
        return usrId;
    }

    public void setUsrId(UUID usrId) {
        this.usrId = usrId;
    }

    public ZonedDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(ZonedDateTime createAt) {
        this.createAt = createAt;
    }
}
