package world.ludium.education.article;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "tb_art")
public class Article {

    @Id
    private UUID id;
    private String title;
    private String content;
    private UUID usrId;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getUsrId() {
        return usrId;
    }

    public void setUsrId(UUID usrId) {
        this.usrId = usrId;
    }
}
