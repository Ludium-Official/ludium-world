package world.ludium.education.apply;

import java.util.UUID;

public class LudiumProviderDTO {
    private UUID id;
    private String nick;
    private String content;
    private UUID applyId;
    private UUID usrId;

    public LudiumProviderDTO() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getApplyId() {
        return applyId;
    }

    public void setApplyId(UUID applyId) {
        this.applyId = applyId;
    }

    public UUID getUsrId() {
        return usrId;
    }

    public void setUsrId(UUID usrId) {
        this.usrId = usrId;
    }
}
