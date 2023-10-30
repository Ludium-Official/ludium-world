package world.ludium.education.mission;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "tb_msn_sbm")
public class MissionSubmit {
    @Id
    private UUID id;
    private String content;
    private UUID usrId;
    private UUID msnId;

    private boolean vldStt;

    public UUID getId() { return id; }

    public void setId(UUID id) { this.id = id; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }

    public UUID getUsrId() { return usrId; }

    public void setUsrId(UUID usrId) { this.usrId = usrId; }

    public UUID getMsnId() { return msnId; }

    public void setMsnId(UUID msnId) { this.msnId = msnId; }

    public boolean isVldStt() {
        return vldStt;
    }

    public void setVldStt(boolean vldStt) {
        this.vldStt = vldStt;
    }
}
