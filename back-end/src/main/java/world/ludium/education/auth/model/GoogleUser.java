package world.ludium.education.auth.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigInteger;

@Entity
@Table(name = "tb_ggl_auth_info")
public class GoogleUser {

  @Id
  private BigInteger ggl_id;
  private String ggl_gvn;
  private String ggl_nm;
  private String ggl_eml;

  public BigInteger getGgl_id() {
    return ggl_id;
  }

  public void setGgl_id(BigInteger ggl_id) {
    this.ggl_id = ggl_id;
  }

  public String getGgl_gvn() {
    return ggl_gvn;
  }

  public void setGgl_gvn(String ggl_gvn) {
    this.ggl_gvn = ggl_gvn;
  }

  public String getGgl_nm() {
    return ggl_nm;
  }

  public void setGgl_nm(String ggl_nm) {
    this.ggl_nm = ggl_nm;
  }

  public String getGgl_eml() {
    return ggl_eml;
  }

  public void setGgl_eml(String ggl_eml) {
    this.ggl_eml = ggl_eml;
  }
}
