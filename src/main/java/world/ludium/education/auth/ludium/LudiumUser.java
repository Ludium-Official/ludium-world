package world.ludium.education.auth.ludium;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigInteger;
import java.util.UUID;

@Entity
@Table(name = "tb_ldm_usr")
public class LudiumUser {
    @Id
    @GeneratedValue
    private UUID id;
    private String nick;
    private String self_intro;
    private String phn_nmb;
    private BigInteger ggl_id;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getSelf_intro() {
        return self_intro;
    }

    public void setSelf_intro(String self_intro) {
        this.self_intro = self_intro;
    }

    public String getPhn_nmb() {
        return phn_nmb;
    }

    public void setPhn_nmb(String phn_nmb) {
        this.phn_nmb = phn_nmb;
    }

    public BigInteger getGgl_id() {
        return ggl_id;
    }

    public void setGgl_id(BigInteger ggl_id) {
        this.ggl_id = ggl_id;
    }
}
