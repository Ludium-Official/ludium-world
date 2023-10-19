package world.ludium.education.auth.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "tb_ldm_usr_rgh")
public class LudiumUserRight {

  @Id
  private UUID id;
  private boolean isCrt;
  private boolean isPrv;
  private boolean isAdm;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public boolean isCrt() {
    return isCrt;
  }

  public void setCrt(boolean crt) {
    isCrt = crt;
  }

  public boolean isPrv() {
    return isPrv;
  }

  public void setPrv(boolean prv) {
    isPrv = prv;
  }

  public boolean isAdm() {
    return isAdm;
  }

  public void setAdm(boolean adm) {
    isAdm = adm;
  }

  public static LudiumUserRight contributor() {
    LudiumUserRight contributor = new LudiumUserRight();
    contributor.setCrt(true);
    contributor.setPrv(false);
    contributor.setAdm(false);
    return contributor;
  }
}
