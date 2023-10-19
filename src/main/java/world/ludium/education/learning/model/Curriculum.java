package world.ludium.education.learning.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "curriculum")
public class Curriculum {

  @Id
  private UUID curriculumId;
  private UUID postingId;
  private String title;
  private String description;
  private Timestamp createAt;
  private UUID usrId;
  private Integer orderNum;

  public UUID getCurriculumId() {
    return curriculumId;
  }

  public void setCurriculumId(UUID curriculumId) {
    this.curriculumId = curriculumId;
  }

  public UUID getPostingId() {
    return postingId;
  }

  public void setPostingId(UUID postingId) {
    this.postingId = postingId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Timestamp getCreateAt() {
    return createAt;
  }

  public void setCreateAt(Timestamp createAt) {
    this.createAt = createAt;
  }

  public UUID getUsrId() {
    return usrId;
  }

  public void setUsrId(UUID usrId) {
    this.usrId = usrId;
  }

  public Integer getOrderNum() {
    return orderNum;
  }

  public void setOrderNum(Integer orderNum) {
    this.orderNum = orderNum;
  }
}
