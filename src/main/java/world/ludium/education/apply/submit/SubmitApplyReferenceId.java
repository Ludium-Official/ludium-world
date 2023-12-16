package world.ludium.education.apply.submit;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class SubmitApplyReferenceId implements Serializable {
    private UUID aplId;
    private UUID usrId;

    public SubmitApplyReferenceId() {
    }

    public SubmitApplyReferenceId(UUID aplId, UUID usrId) {
        this.aplId = aplId;
        this.usrId = usrId;
    }

    public UUID getAplId() {
        return aplId;
    }

    public void setAplId(UUID aplId) {
        this.aplId = aplId;
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
        SubmitApplyReferenceId that = (SubmitApplyReferenceId) o;
        return Objects.equals(aplId, that.aplId) && Objects.equals(usrId, that.usrId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(aplId, usrId);
    }
}
