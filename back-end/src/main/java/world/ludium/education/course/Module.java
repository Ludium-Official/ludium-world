package world.ludium.education.course;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "tb_mdl")
public class Module {
    @Id
    private UUID id;
    private String title;
    private String content;
    private String category;
    private UUID crsId;

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public UUID getCrsId() {
        return crsId;
    }

    public void setCrsId(UUID crsId) {
        this.crsId = crsId;
    }
}
