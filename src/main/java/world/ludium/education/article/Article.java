package world.ludium.education.article;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "tb_art")
public class Article {

    @Id
    private UUID id;
    private String title;
    private String content;
    private UUID usrId;
    @Enumerated(EnumType.STRING)
    private Category category;
    private boolean isVisible;

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

    public UUID getUsrId() { return usrId; }

    public void setUsrId(UUID usrId) { this.usrId = usrId; }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public boolean isVisible() {
        return isVisible;
    }

    public void setVisible(boolean visible) {
        isVisible = visible;
    }

    public static Article Module() {
        Article module = new Article();

        module.setContent("");
        module.setTitle("");
        module.setCategory(Category.MODULE);
        module.setVisible(true);

        return module;
    }

    public static Article Announcement() {
        Article announcement = new Article();

        announcement.setCategory(Category.ANNOUNCEMENT);
        announcement.setVisible(true);

        return announcement;
    }

    public static Article Apply() {
        Article apply = new Article();

        apply.setCategory(Category.APPLY);
        apply.setVisible(true);

        return apply;
    }

    public static Article ApplyProvider() {
        Article applyProvider = new Article();

        applyProvider.setCategory(Category.PROVIDER_APPLY);
        applyProvider.setVisible(true);


        return applyProvider;
    }
}
