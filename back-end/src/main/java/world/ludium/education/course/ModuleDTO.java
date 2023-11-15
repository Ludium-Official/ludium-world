package world.ludium.education.course;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ModuleDTO {
    private UUID id;
    private String title;
    private String content;
    private String category;
    private List<ModuleReference> moduleReferences;

    public ModuleDTO() {
        this.moduleReferences = new ArrayList<>();
    }

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

    public List<ModuleReference> getModuleReferences() {
        return moduleReferences;
    }

    public void setModuleReferences(List<ModuleReference> moduleReferences) {
        this.moduleReferences = moduleReferences;
    }
}
