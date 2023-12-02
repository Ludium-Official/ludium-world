package world.ludium.education.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MissionSubmitCommentRepository extends JpaRepository<MissionSubmitComment, UUID> {
    List<MissionSubmitComment> findAllByMsnSbmId(UUID msnSbmId);
    List<MissionSubmitComment> findAllByUsrId(UUID usrId);

    void deleteAllByMsnSbmId(UUID msnSbmId);
}
