package world.ludium.education.auth.model;

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
  private String selfIntro;
  private String phnNmb;
  private BigInteger gglId;
  private String avatar;

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

  public String getSelfIntro() {
    return selfIntro;
  }

  public void setSelfIntro(String selfIntro) {
    this.selfIntro = selfIntro;
  }

  public String getPhnNmb() {
    return phnNmb;
  }

  public void setPhnNmb(String phnNmb) {
    this.phnNmb = phnNmb;
  }

  public BigInteger getGglId() {
    return gglId;
  }

  public void setGglId(BigInteger gglId) {
    this.gglId = gglId;
  }

  public String getAvatar() {
    return avatar;
  }

  public void setAvatar(String avatar) {
    this.avatar = avatar;
  }

  @Override
  public String toString() {
    return "LudiumUser{"
        + "id=" + id
        + ", nick='" + nick + '\''
        + ", selfIntro='" + selfIntro + '\''
        + ", phnNmb='" + phnNmb + '\''
        + ", gglId=" + gglId
        + ", avatar='" + avatar + '\''
        + '}';
  }
}
