package world.ludium.education.learning.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "mission")
public class Mission {

  @Id
  private UUID missionId;
  private UUID curriculumId;
  private String title;
  private String description;
  private Timestamp createAt;
  private UUID usrId;
  private String missionSubmitForm;
  private Integer orderNum;
  private UUID rewardToken;
  private Double rewardAmount;

  public UUID getMissionId() {
    return missionId;
  }

  public void setMissionId(UUID missionId) {
    this.missionId = missionId;
  }

  public UUID getCurriculumId() {
    return curriculumId;
  }

  public void setCurriculumId(UUID curriculumId) {
    this.curriculumId = curriculumId;
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

  public String getMissionSubmitForm() {
    return missionSubmitForm;
  }

  public void setMissionSubmitForm(String missionSubmitForm) {
    this.missionSubmitForm = missionSubmitForm;
  }

  public Integer getOrderNum() {
    return orderNum;
  }

  public void setOrderNum(Integer orderNum) {
    this.orderNum = orderNum;
  }

  public UUID getRewardToken() {
    return rewardToken;
  }

  public void setRewardToken(UUID rewardToken) {
    this.rewardToken = rewardToken;
  }

  public Double getRewardAmount() {
    return rewardAmount;
  }

  public void setRewardAmount(Double rewardAmount) {
    this.rewardAmount = rewardAmount;
  }
}
