package world.ludium.education.article;

import java.util.UUID;

public class ModuleReferenceArticleDTO {
    private UUID id;
    private String title;
    private String content;
    private UUID usrId;
    private Category category;
    private boolean checked;

    public ModuleReferenceArticleDTO(UUID id, String title, String content, UUID usrId, Category category, boolean checked) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.usrId = usrId;
        this.category = category;
        this.checked = checked;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public UUID getUsrId() {
        return usrId;
    }

    public Category getCategory() {
        return category;
    }

    public boolean isChecked() {
        return checked;
    }
}
