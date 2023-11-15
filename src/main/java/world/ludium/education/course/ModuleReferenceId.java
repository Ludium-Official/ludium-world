package world.ludium.education.course;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class ModuleReferenceId implements Serializable {
    private UUID mdlId;
    private UUID artId;

    public ModuleReferenceId(UUID mdlId, UUID artId) {
        this.mdlId = mdlId;
        this.artId = artId;
    }

    public UUID getMdlId() {
        return mdlId;
    }

    public void setMdlId(UUID mdlId) {
        this.mdlId = mdlId;
    }

    public UUID getArtId() {
        return artId;
    }

    public void setArtId(UUID artId) {
        this.artId = artId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ModuleReferenceId that = (ModuleReferenceId) o;
        return Objects.equals(getMdlId(), that.getMdlId()) && Objects.equals(getArtId(), that.getArtId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getMdlId(), getArtId());
    }
}
