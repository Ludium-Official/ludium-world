package world.ludium.education.announcement.model;

import java.util.Objects;
import java.util.UUID;

public class DetailedAnnouncementCoWorkerId {

  private UUID detailId;
  private UUID usrId;

  public DetailedAnnouncementCoWorkerId() {
  }

  public UUID getDetailId() {
    return detailId;
  }

  public void setDetailId(UUID detailId) {
    this.detailId = detailId;
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
    DetailedAnnouncementCoWorkerId that = (DetailedAnnouncementCoWorkerId) o;
    return Objects.equals(getDetailId(), that.getDetailId()) && Objects.equals(getUsrId(),
        that.getUsrId());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getDetailId(), getUsrId());
  }

  @Override
  public String toString() {
    return "DetailedAnnouncementCoWorkerId{"
        + "detailId=" + detailId
        + ", usrId=" + usrId
        + '}';
  }
}
