package world.ludium.education.course;

import world.ludium.education.article.Article;

import java.util.List;
import java.util.UUID;

public class CourseDTO {
    private UUID id;
    private String title;
    private String content;
    private List<Article> modules;

    public CourseDTO() {
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

    public List<Article> getModules() {
        return modules;
    }

    public void setModules(List<Article> modules) {
        this.modules = modules;
    }
}
