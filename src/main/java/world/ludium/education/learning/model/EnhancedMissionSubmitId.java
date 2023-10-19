package world.ludium.education.learning.model;

import java.util.Objects;
import java.util.UUID;

public class EnhancedMissionSubmitId {

  private UUID missionId;
  private UUID usrId;

  public EnhancedMissionSubmitId() {
  }

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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EnhancedMissionSubmitId that = (EnhancedMissionSubmitId) o;
    return Objects.equals(missionId, that.missionId) && Objects.equals(usrId, that.usrId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(missionId, usrId);
  }

  @Override
  public String toString() {
    return "EnhancedMissionSubmitId{"
        + "missionId=" + missionId
        + ", usrId=" + usrId
        + '}';
  }
}
