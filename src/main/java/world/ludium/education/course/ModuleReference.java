package world.ludium.education.course;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "tb_mdl_ref")
@IdClass(ModuleReferenceId.class)
public class ModuleReference {

    // 복합 기본 키 설정
    @Id
    private UUID mdlId;

    @Id
    private UUID artId;

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
}
