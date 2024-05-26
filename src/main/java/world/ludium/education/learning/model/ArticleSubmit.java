package world.ludium.education.learning.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "article_submit")
@IdClass(ArticleSubmitId.class)
public class ArticleSubmit {

  @Id
  private UUID articleId;
  @Id
  private UUID usrId;
  private String status;
  private Timestamp createAt;

  public UUID getArticleId() {
    return articleId;
  }

  public void setArticleId(UUID articleId) {
    this.articleId = articleId;
  }

  public UUID getUsrId() {
    return usrId;
  }

  public void setUsrId(UUID usrId) {
    this.usrId = usrId;
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
