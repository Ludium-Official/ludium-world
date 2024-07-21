package world.ludium.education.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import world.ludium.education.payment.model.RewardClaim;

import java.util.Optional;
import java.util.UUID;

public interface RewardClaimRepository extends JpaRepository<RewardClaim, UUID> {
    public Optional<RewardClaim> findByResourceIdAndUserId(UUID missionId, UUID userId);
}
