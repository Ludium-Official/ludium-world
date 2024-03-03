package world.ludium.education.announcement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "detailed_posting_co_worker")
@IdClass(DetailedAnnouncementCoWorkerId.class)
public class DetailedAnnouncementCoWorker {
    @Id
    private UUID detailId;
    @Id
    private UUID usrId;

    public UUID getDetailId() {
        return detailId;
    }

    public void setDetailId(UUID detailId) {
        this.detailId = detailId;
    }

    public UUID getUsrId() {
        return usrId;
    }

    public void setUsrId(UUID usrId) {
        this.usrId = usrId;
    }
}
