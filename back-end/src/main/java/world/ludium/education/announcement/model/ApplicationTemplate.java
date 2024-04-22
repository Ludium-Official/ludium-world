package world.ludium.education.announcement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "application_template")
public class ApplicationTemplate {

  @Id
  private UUID applicationTemplateId;
  private String title;
  private String description;
  private UUID detailId;
  private String role;

  public UUID getApplicationTemplateId() {
    return applicationTemplateId;
  }

  public void setApplicationTemplateId(UUID applicationTemplateId) {
    this.applicationTemplateId = applicationTemplateId;
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

  public UUID getDetailId() {
    return detailId;
  }

  public void setDetailId(UUID detailId) {
    this.detailId = detailId;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }
}
