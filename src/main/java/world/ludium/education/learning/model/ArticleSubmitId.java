package world.ludium.education.learning.model;

import java.util.Objects;
import java.util.UUID;

public class ArticleSubmitId {

  private UUID articleId;
  private UUID usrId;

  public ArticleSubmitId() {
  }

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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ArticleSubmitId that = (ArticleSubmitId) o;
    return Objects.equals(articleId, that.articleId) && Objects.equals(usrId, that.usrId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(articleId, usrId);
  }

  @Override
  public String toString() {
    return "ArticleSubmitId{"
        + "articleId=" + articleId
        + ", usrId=" + usrId
        + '}';
  }
}
