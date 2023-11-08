package world.ludium.education.auth.google;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigInteger;

@Entity
@Table(name = "tb_ggl_rfr_tk")
public class GoogleRefreshToken {
    @Id
    private BigInteger gglId;
    private String gglTk;

    public BigInteger getGglId() {
        return gglId;
    }

    public void setGglId(BigInteger gglId) {
        this.gglId = gglId;
    }

    public String getGglTk() {
        return gglTk;
    }

    public void setGglTk(String gglTk) {
        this.gglTk = gglTk;
    }
}
