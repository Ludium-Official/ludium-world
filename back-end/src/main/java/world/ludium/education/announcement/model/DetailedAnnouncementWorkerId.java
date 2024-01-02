package world.ludium.education.announcement.model;

import jakarta.persistence.Id;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class DetailedAnnouncementWorkerId implements Serializable {
    private UUID detailId;
    private String role;

    public DetailedAnnouncementWorkerId() {
    }

    public UUID getDetailId() {
        return detailId;
    }

    public void setDetailId(UUID detailId) {
        this.detailId = detailId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DetailedAnnouncementWorkerId that = (DetailedAnnouncementWorkerId) o;
        return getDetailId().equals(that.getDetailId()) && getRole().equals(that.getRole());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getDetailId(), getRole());
    }

    @Override
    public String toString() {
        return "DetailedAnnouncementWorkerId{" +
                "detailId=" + detailId +
                ", role='" + role + '\'' +
                '}';
    }
}
