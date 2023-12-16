package world.ludium.education.apply.submit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SubmitApplyReferenceRepository  extends JpaRepository<SubmitApplyReference, UUID> {
    Optional<SubmitApplyReference> findByAplIdAndUsrId(UUID aplId, UUID usrId);

    long countByAplId(UUID aplId);

    List<SubmitApplyReference> findAllByAplId(UUID aplId);
}
