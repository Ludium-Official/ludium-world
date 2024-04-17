package world.ludium.education.learning.model;

import java.sql.Timestamp;
import java.util.Objects;
import java.util.UUID;

public class EnhancedMissionSubmitCommentId {

  private UUID missionId;
  private UUID usrId;
  private Timestamp createAt;

  public EnhancedMissionSubmitCommentId() {
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

  public Timestamp getCreateAt() {
    return createAt;
  }

  public void setCreateAt(Timestamp createAt) {
    this.createAt = createAt;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EnhancedMissionSubmitCommentId that = (EnhancedMissionSubmitCommentId) o;
    return Objects.equals(missionId, that.missionId) && Objects.equals(usrId, that.usrId)
        && Objects.equals(createAt, that.createAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(missionId, usrId, createAt);
  }

  @Override
  public String toString() {
    return "EnhancedMissionSubmitCommentId{"
        + "missionId=" + missionId
        + ", usrId=" + usrId
        + ", createAt=" + createAt
        + '}';
  }
}
