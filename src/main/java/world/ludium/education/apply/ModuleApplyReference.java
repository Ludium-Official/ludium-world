package world.ludium.education.apply;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "tb_apl_mdn_ref")
public class ModuleApplyReference {
    @Id
    private UUID aplId;

    private UUID mdlId;

    public UUID getAplId() {
        return aplId;
    }

    public void setAplId(UUID aplId) {
        this.aplId = aplId;
    }

    public UUID getMdlId() {
        return mdlId;
    }

    public void setMdlId(UUID mdlId) {
        this.mdlId = mdlId;
    }
}
