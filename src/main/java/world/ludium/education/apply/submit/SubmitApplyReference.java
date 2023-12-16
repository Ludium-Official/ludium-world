package world.ludium.education.apply.submit;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "tb_apl_sbm_ref")
@IdClass(SubmitApplyReferenceId.class)
public class SubmitApplyReference {
    @Id
    private UUID aplId;
    private UUID sbmId;
    @Id
    private UUID usrId;

    public UUID getAplId() {
        return aplId;
    }

    public void setAplId(UUID aplId) {
        this.aplId = aplId;
    }

    public UUID getSbmId() {
        return sbmId;
    }

    public void setSbmId(UUID sbmId) {
        this.sbmId = sbmId;
    }

    public UUID getUsrId() {
        return usrId;
    }

    public void setUsrId(UUID usrId) {
        this.usrId = usrId;
    }
}
