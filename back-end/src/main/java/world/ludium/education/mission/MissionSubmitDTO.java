package world.ludium.education.mission;

import java.util.UUID;

public class MissionSubmitDTO {
    private UUID id;
    private String content;
    private boolean vldStt;
    private String nick;

    public MissionSubmitDTO(UUID id, String content, boolean vldStt, String nick) {
        this.id = id;
        this.content = content;
        this.vldStt = vldStt;
        this.nick = nick;
    }

    public UUID getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public boolean isVldStt() {
        return vldStt;
    }

    public String getNick() {
        return nick;
    }
}
