package world.ludium.education.mission;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_msn_sbm_hst")
public class MissionSubmitHistory {
    @Id
    private UUID id;

    private UUID msnSbmId;

    private String content;

    private ZonedDateTime createAt;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getMsnSbmId() {
        return msnSbmId;
    }

    public void setMsnSbmId(UUID msnSbmId) {
        this.msnSbmId = msnSbmId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ZonedDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(ZonedDateTime createAt) {
        this.createAt = createAt;
    }
}
