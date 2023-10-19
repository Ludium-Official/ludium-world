package world.ludium.education.learning.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "mission_submit")
@IdClass(EnhancedMissionSubmitId.class)
public class EnhancedMissionSubmit {

  @Id
  private UUID missionId;
  @Id
  private UUID usrId;
  private String description;
  private String status;
  private Timestamp createAt;

  public UUID getMissionId() {
    return missionId;
  }

  public void setMissionId(UUID missionId) {
    this.missionId = missionId;
  }

  public UUID getUsrId() {
    return usrId;
  }

  public void setUsrId(UUID usrId) {
    this.usrId = usrId;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Timestamp getCreateAt() {
    return createAt;
  }

  public void setCreateAt(Timestamp createAt) {
    this.createAt = createAt;
  }
}
