package world.ludium.education.course;

import jakarta.persistence.*;
import world.ludium.education.make.Category;

import java.util.UUID;

@Entity
@Table(name = "tb_mdl")
public class Module {
    @Id
    private UUID id;
    private String title;
    private String content;
    @Enumerated(EnumType.STRING)
    private Category category;
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public UUID getCrsId() {
        return crsId;
    }

    public void setCrsId(UUID crsId) {
        this.crsId = crsId;
    }
}
